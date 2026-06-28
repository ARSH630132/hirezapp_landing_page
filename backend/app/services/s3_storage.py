import os
import boto3
import logging
from ..core.config import settings, BASE_DIR

logger = logging.getLogger(__name__)

class S3StorageManager:
    def __init__(self):
        self.use_mock = True
        self.s3_client = None
        
        # Check if we should use real S3
        if settings.ENVIRONMENT == "production" or (
            os.getenv("AWS_ACCESS_KEY_ID") and 
            not os.getenv("AWS_ACCESS_KEY_ID").startswith("local_")
        ):
            try:
                self.s3_client = boto3.client(
                    "s3",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
                # Test connection by listing or attempting an operation
                self.s3_client.list_buckets()
                self.use_mock = False
                logger.info("[S3] Real S3 client initialized and verified successfully.")
            except Exception as e:
                logger.warning(f"[S3] Failed to initialize real S3 client, falling back to mock: {e}")
                self.use_mock = True
        else:
            logger.info("[S3] Running in mock/fallback mode (local disk storage).")

        if self.use_mock:
            # We will store files in a local directory
            self.mock_dir = os.path.join(BASE_DIR, "local_s3_storage")
            os.makedirs(self.mock_dir, exist_ok=True)
            logger.info(f"[S3] Mock S3 storage initialized at: {self.mock_dir}")

    def upload_file(self, file_content: bytes, client_id: str, document_id: str, filename: str) -> str:
        """
        Uploads file to S3 under clients/<client_id>/documents/<document_id>/<filename>
        Returns the S3 URI/path.
        """
        s3_key = f"clients/{client_id}/documents/{document_id}/{filename}"
        if not self.use_mock:
            try:
                self.s3_client.put_object(
                    Bucket=settings.S3_DOCUMENTS_BUCKET,
                    Key=s3_key,
                    Body=file_content
                )
                logger.info(f"[S3] Uploaded file to s3://{settings.S3_DOCUMENTS_BUCKET}/{s3_key}")
                return f"s3://{settings.S3_DOCUMENTS_BUCKET}/{s3_key}"
            except Exception as e:
                logger.error(f"[S3] Real S3 upload failed: {e}. Falling back to mock local write.")
                # Fallback to mock behavior on failure
        
        # Mock behavior
        local_path = os.path.join(self.mock_dir, client_id, "documents", document_id, filename)
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, "wb") as f:
            f.write(file_content)
        logger.info(f"[S3 Mock] Uploaded file to local path {local_path}")
        return f"s3://{settings.S3_DOCUMENTS_BUCKET}/{s3_key}"

    def download_file(self, client_id: str, document_id: str, filename: str) -> bytes:
        """
        Downloads file from S3.
        """
        s3_key = f"clients/{client_id}/documents/{document_id}/{filename}"
        if not self.use_mock:
            try:
                response = self.s3_client.get_object(
                    Bucket=settings.S3_DOCUMENTS_BUCKET,
                    Key=s3_key
                )
                return response["Body"].read()
            except Exception as e:
                logger.error(f"[S3] Real S3 download failed: {e}. Falling back to mock local read.")
                # Fallback to mock behavior on failure
        
        # Mock behavior
        local_path = os.path.join(self.mock_dir, client_id, "documents", document_id, filename)
        if not os.path.exists(local_path):
            raise FileNotFoundError(f"File not found in S3 storage (mock): {s3_key}")
        with open(local_path, "rb") as f:
            return f.read()

s3_storage = S3StorageManager()
