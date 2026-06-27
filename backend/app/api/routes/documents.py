from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response
from typing import List, Optional
import hashlib
import datetime

from ...db.session import get_db
from ...models.user import User
from ...models.document_item import DocumentItem
from ...api.deps import get_current_user
from ...repositories.portal_items import portal_items_repo
from ...services.s3_storage import s3_storage

router = APIRouter()

@router.get("")
def list_documents(
    client_id: Optional[int] = None,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List GFF portal items of type DOCUMENT.
    Strictly scopes non-admin users to their assigned client_id.
    """
    target_client_id = client_id
    if current_user.role not in ["admin", "gff_admin"]:
        if current_user.client_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not belong to any client account."
            )
        if target_client_id is not None and target_client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested client's documents."
            )
        target_client_id = current_user.client_id

    cid_str = str(target_client_id) if target_client_id is not None else None
    docs = portal_items_repo.list_items("DOCUMENT", client_id=cid_str)
    return [d.to_dict() for d in docs]


@router.get("/{id}")
def get_document(
    id: int,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve document metadata by ID with strict client scoping.
    """
    documents = portal_items_repo.list_items("DOCUMENT")
    doc = next((d for d in documents if str(d.id) == str(id)), None)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # Scoping boundary check
    if current_user.role not in ["admin", "gff_admin"]:
        if str(doc.client_id) != str(current_user.client_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You do not have permission to view this document."
            )

    return doc.to_dict()


@router.post("/upload", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    client_id: int = Form(...),
    project_id: Optional[int] = Form(None),
    title: Optional[str] = Form(None),
    document_type: Optional[str] = Form(None),
    version: str = Form("1.0.0"),
    visibility: str = Form("private"),
    description: Optional[str] = Form(None),
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Secure multi-part upload. Writes files to S3 (or mock local disk)
    and saves document metadata in GFF_PORTAL_ITEMS and SQLite DB.
    """
    # Authorization check
    if current_user.role not in ["admin", "gff_admin"]:
        if current_user.client_id is None or current_user.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to upload documents for this client."
            )

    # Read file content
    file_content = await file.read()
    if not file_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # Format filesize
    size_kb = len(file_content) / 1024
    if size_kb > 1024:
        file_size_str = f"{size_kb / 1024:.1f} MB"
    else:
        file_size_str = f"{size_kb:.1f} KB"

    # Calculate SHA-256 for cryptographic ledger sealing
    sha256_hash = f"0x{hashlib.sha256(file_content).hexdigest().upper()}"

    # Determine unique document ID
    document_id = portal_items_repo._get_next_id("DOCUMENT")

    # Upload to S3 storage manager
    s3_uri = s3_storage.upload_file(file_content, str(client_id), str(document_id), file.filename)

    # 1. Store in SQLite for persistence
    db_doc = DocumentItem(
        id=document_id,
        client_id=client_id,
        project_id=project_id,
        title=title or file.filename,
        filename=file.filename,
        document_type=document_type or "PDF",
        status="active",
        version=version,
        owner=current_user.full_name or current_user.email,
        visibility=visibility,
        sha256=sha256_hash,
        file_size=file_size_str,
        description=description or "Cryptographically secured enclave system documentation.",
        s3_uri=s3_uri
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)

    # 2. Store metadata in GFF_PORTAL_ITEMS as DOCUMENT record (DynamoDB mock)
    # This keeps our DynamoDB emulator table synchronized immediately.
    item_data = {
        "id": document_id,
        "project_id": project_id,
        "title": title or file.filename,
        "filename": file.filename,
        "document_type": document_type or "PDF",
        "status": "active",
        "version": version,
        "owner": current_user.full_name or current_user.email,
        "visibility": visibility,
        "sha256": sha256_hash,
        "fileSize": file_size_str,
        "description": description or "Cryptographically secured enclave system documentation.",
        "lastUpdated": datetime.datetime.utcnow().isoformat(),
        "s3_uri": s3_uri
    }
    portal_item = portal_items_repo.create_item("DOCUMENT", str(client_id), item_data)

    return {
        "success": True,
        "message": "Document uploaded successfully.",
        "document": portal_item.to_dict()
    }


@router.get("/download/{id}")
def download_document(
    id: int,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Downloads file from S3 bucket with strict boundary permissions.
    """
    documents = portal_items_repo.list_items("DOCUMENT")
    doc = next((d for d in documents if str(d.id) == str(id)), None)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # Non-admin boundary validation
    if current_user.role not in ["admin", "gff_admin"]:
        if str(doc.client_id) != str(current_user.client_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You do not have permission to download this document."
            )

    # Fetch filename safely
    filename_val = getattr(doc, "filename", None) or getattr(doc, "title", "document")

    try:
        # Fetch actual bytes from S3/mock store
        file_content = s3_storage.download_file(str(doc.client_id), str(doc.id), filename_val)
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document file not found in storage."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Storage driver exception: {str(e)}"
        )

    return Response(
        content=file_content,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename_val}"}
    )

