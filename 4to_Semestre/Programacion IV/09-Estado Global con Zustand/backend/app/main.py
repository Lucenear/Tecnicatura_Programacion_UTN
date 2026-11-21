from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.modules.health.router import router as health_router
from app.modules.usuarios.router import router as auth_router
from app.modules.categorias.router import router as categorias_router
from app.modules.productos.router import router as productos_router
from app.modules.pedidos.router import router as pedidos_router
from app.modules.catalogos.router import router as catalogos_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Food Store API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router, prefix="/auth")
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(categorias_router, prefix="/categorias")
app.include_router(categorias_router, prefix="/categories")
app.include_router(productos_router, prefix="/productos")
app.include_router(productos_router, prefix="/products")
app.include_router(pedidos_router, prefix="/pedidos")
app.include_router(pedidos_router, prefix="/orders")
app.include_router(catalogos_router)
