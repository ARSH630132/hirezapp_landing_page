import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import HTTPException
from app.db.session import SessionLocal
from app.models.client_account import ClientAccount
from app.schemas.client_account import ClientAccountCreate, ClientAccountUpdate
from app.api.routes.clients import (
    list_clients, get_client, create_client, update_client, delete_client
)

class MockUser:
    def __init__(self):
        self.email = "admin@gff.ai"
        self.role = "admin"

def run_api_tests():
    db = SessionLocal()
    usr = MockUser()
    db.query(ClientAccount).filter(ClientAccount.name.like("TEST_CLIENT_%")).delete()
    db.commit()
    
    print("Testing create_client...")
    c1 = create_client(client_in=ClientAccountCreate(
        name="TEST_CLIENT_ALPHA", industry="Sovereign AI", region="Europe", status="active", account_owner="GFF Alpha"
    ), db=db, current_user=usr)
    assert c1.id is not None and c1.name == "TEST_CLIENT_ALPHA"
    
    try:
        create_client(client_in=ClientAccountCreate(
            name="TEST_CLIENT_ALPHA", industry="Sovereign AI"
        ), db=db, current_user=usr)
        assert False, "Should have raised 400"
    except HTTPException as e:
        assert e.status_code == 400
    
    print("Testing get_client...")
    ret = get_client(client_id=c1.id, db=db, current_user=usr)
    assert ret.id == c1.id and ret.name == "TEST_CLIENT_ALPHA"
    try:
        get_client(client_id=999999, db=db, current_user=usr)
        assert False, "Should have raised 404"
    except HTTPException as e:
        assert e.status_code == 404
        
    print("Testing list_clients and filtering...")
    c2 = create_client(client_in=ClientAccountCreate(
        name="TEST_CLIENT_BETA", industry="BioTech", region="Asia", status="pending", account_owner="GFF Beta"
    ), db=db, current_user=usr)
    
    assert len(list_clients(db=db, current_user=usr, limit=100, skip=0)) >= 2
    assert len(list_clients(search="BETA", db=db, current_user=usr, limit=100, skip=0)) == 1
    assert all(c.status == "pending" for c in list_clients(status="pending", db=db, current_user=usr, limit=100, skip=0))
    assert all(c.region == "Europe" for c in list_clients(region="Europe", db=db, current_user=usr, limit=100, skip=0))
    
    print("Testing update_client...")
    upd = update_client(client_id=c2.id, client_in=ClientAccountUpdate(
        region="North America", status="active"
    ), db=db, current_user=usr)
    assert upd.region == "North America" and upd.status == "active"
    
    print("Testing delete_client (soft archive)...")
    soft = delete_client(client_id=c1.id, hard_delete=False, db=db, current_user=usr)
    assert soft.status == "archived"
    assert db.query(ClientAccount).filter(ClientAccount.id == c1.id).first().status == "archived"
    
    print("Testing delete_client (hard delete)...")
    hard = delete_client(client_id=c1.id, hard_delete=True, db=db, current_user=usr)
    assert hard.status == "deleted"
    assert db.query(ClientAccount).filter(ClientAccount.id == c1.id).first() is None
    
    delete_client(client_id=c2.id, hard_delete=True, db=db, current_user=usr)
    db.close()
    print("All ClientAccount CRUD API tests completed successfully!")

if __name__ == "__main__":
    try:
        run_api_tests()
        sys.exit(0)
    except AssertionError:
        import traceback
        traceback.print_exc()
        sys.exit(1)
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

