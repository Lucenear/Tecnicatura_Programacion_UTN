from typing import Generic, TypeVar, Type, Optional, List
from sqlmodel import Session, select

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_all(self) -> List[T]:
        statement = select(self.model)
        return list(self.session.exec(statement).all())

    def get_by_id(self, id: int) -> Optional[T]:
        return self.session.get(self.model, id)

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()
        return entity

    def update(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
        self.session.flush()
