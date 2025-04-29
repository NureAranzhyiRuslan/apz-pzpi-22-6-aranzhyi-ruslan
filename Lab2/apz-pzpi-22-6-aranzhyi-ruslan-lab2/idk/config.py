from os import urandom, environ
from base64 import b64decode

IS_DEBUG = True

DB_CONNECTION_STRING = environ.get("DB_CONNECTION_STRING", "sqlite://noidea.db")
JWT_KEY = b64decode(environ["JWT_KEY"]) if "JWT_KEY" in environ else urandom(32)
AUTH_JWT_TTL = 86400 * (7 if IS_DEBUG else 1)
BCRYPT_ROUNDS = 5 if IS_DEBUG else 13
