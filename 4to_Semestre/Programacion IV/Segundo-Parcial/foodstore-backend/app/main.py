from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.core.seed import seed_unidades_medida
from app.modules.unidades_medida.router import router as unidades_router
from app.modules.categorias.router import router as categorias_router
from app.modules.productos.router import router as productos_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_unidades_medida()
    yield

app = FastAPI(
    title="Food Store API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(unidades_router)
api_router.include_router(categorias_router)
api_router.include_router(productos_router)

app.include_router(api_router)
