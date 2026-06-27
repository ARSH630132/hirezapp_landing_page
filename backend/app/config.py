import os
from typing import List, Union
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "GFF AI Enterprise API"
    API_V1_STR: str = "/api/v1"
    
    # Environment config
    ENVIRONMENT: str = "development"
    
    # Database (local SQLite by default)
    DATABASE_URL: str = "sqlite:///./gff_ai_local.db"
    
    # Security (local-only placeholders)
    JWT_SECRET: str = "gff_ai_super_secret_local_key_for_jwt_tokens_2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS (origins allowed to connect)
    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000", "http://127.0.0.1:3000"]

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
