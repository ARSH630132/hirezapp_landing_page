import os
from typing import List, Union
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

# Dynamically resolve absolute path of backend/dev.db relative to this config file
# backend/app/core/config.py -> backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "dev.db")
DEFAULT_DATABASE_URL = f"sqlite:///{DEFAULT_DB_PATH}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "GFF AI Enterprise API"
    API_V1_STR: str = "/api/v1"
    
    # Environment config
    ENVIRONMENT: str = "development"
    
    # Database (local SQLite by default)
    DATABASE_URL: str = DEFAULT_DATABASE_URL
    
    # Security (local-only placeholders)
    JWT_SECRET: str = "gff_ai_super_secret_local_key_for_jwt_tokens_2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS (origins allowed to connect)
    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    FRONTEND_BASE_URL: str = "http://localhost:3000"

    # AWS Environment Configuration
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = "local_aws_access_key_id_placeholder"
    AWS_SECRET_ACCESS_KEY: str = "local_aws_secret_access_key_placeholder"

    # DynamoDB Tables Configuration
    DYNAMODB_USERS_TABLE: str = "gff-users-local"
    DYNAMODB_CLIENTS_TABLE: str = "gff-clients-local"
    DYNAMODB_ITEMS_TABLE: str = "gff-portal-items-local"
    DYNAMODB_ITEMS_TYPE_INDEX: str = "GSI1"

    # S3 Storage Configuration
    S3_DOCUMENTS_BUCKET: str = "gff-documents-local"
    S3_DOCUMENTS_PREFIX: str = "clients"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            import json
            try:
                parsed = json.loads(self.CORS_ORIGINS)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return self.CORS_ORIGINS

settings = Settings()
