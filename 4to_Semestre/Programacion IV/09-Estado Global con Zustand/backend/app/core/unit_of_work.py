from sqlmodel import Session
from app.core.database import engine

class BaseUnitOfWork:
    def __init__(self):
        self.session_factory = lambda: Session(engine, expire_on_commit=False)
        self.session = None

    def __enter__(self):
        self.session = self.session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                self.rollback()
            else:
                self.commit()
        finally:
            if self.session is not None:
                self.session.close()

    def commit(self):
        if self.session is not None:
            self.session.commit()

    def rollback(self):
        if self.session is not None:
            self.session.rollback()
