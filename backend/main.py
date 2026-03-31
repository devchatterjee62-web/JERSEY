import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
from typing import List

# ⚡ CREATE UPLOADS FOLDER
os.makedirs("uploads", exist_ok=True)

# ==========================================
# 1. DATABASE CONFIGURATION (V5 ENGINE)
# ==========================================
SQLALCHEMY_DATABASE_URL = "sqlite:///./jersey_v5_database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==========================================
# 2. DATABASE MODELS
# ==========================================
class DBProduct(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(String)
    tag = Column(String, default="NEW DROP")
    image_url = Column(String, default="") 
    category = Column(String, default="Jerseys")
    stock = Column(Integer, default=10) # ⚡ INVENTORY TRACKING
    visibility = Column(Boolean, default=True)

class DBCategory(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class DBGallery(Base):
    __tablename__ = "gallery"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)

class DBPage(Base):
    __tablename__ = "pages"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    banner_url = Column(String, default="")
    content = Column(Text)

class DBSettings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    logo_text = Column(String, default="JERSEY")
    hero_title_1 = Column(String, default="OUTPLAY")
    hero_title_2 = Column(String, default="THEM—")
    hero_title_3 = Column(String, default="ALL.")
    hero_subtitle = Column(String, default="Elite gear for matchday dominance.")
    hero_image_url = Column(String, default="") 
    hero_video_url = Column(String, default="") 
    marquee_text = Column(String, default="LIMITED STOCK ⚡ NEW DROP ⚡ MATCH READY ⚡")
    promo_text = Column(String, default="WE ARE THE BEST IN THE GAME. PERIOD.") 
    footer_text = Column(String, default="© 2026 // UNSTOPPABLE PERFORMANCE")
    category_1_title = Column(String, default="TRAINING GEAR")
    category_2_title = Column(String, default="MATCHDAY KITS")
    training_bg_url = Column(String, default="")
    matchday_bg_url = Column(String, default="")
    social_title = Column(String, default="WORN BY PLAYERS.")
    trust_title_1 = Column(String, default="Performance Fabric")
    trust_desc_1 = Column(String, default="Aerodynamic, sweat-wicking materials.")
    trust_title_2 = Column(String, default="Combat Durability")
    trust_desc_2 = Column(String, default="Reinforced stitching.")
    
    # ⚡ FIXED: ADDED THE MISSING ABOUT IMAGES BACK IN
    about_img_1 = Column(String, default="")
    about_img_2 = Column(String, default="")
    
    show_category_split = Column(Boolean, default=True)
    show_social_proof = Column(Boolean, default=True)
    show_trust_builder = Column(Boolean, default=True)

Base.metadata.create_all(bind=engine)

# ==========================================
# 3. SCHEMAS
# ==========================================
class ProductCreate(BaseModel):
    name: str
    price: str
    tag: str
    image_url: str = ""
    category: str = "Jerseys"
    stock: int = 10
    visibility: bool = True

class ProductResponse(ProductCreate):
    id: int
    class Config: 
        from_attributes = True

class CategoryCreate(BaseModel): 
    name: str

class CategoryResponse(CategoryCreate):
    id: int
    class Config: 
        from_attributes = True

class GalleryCreate(BaseModel): 
    image_url: str

class GalleryResponse(GalleryCreate):
    id: int
    class Config: 
        from_attributes = True

class PageCreate(BaseModel): 
    slug: str
    title: str
    banner_url: str = ""
    content: str

class PageResponse(PageCreate):
    id: int
    class Config: 
        from_attributes = True

class SettingsBase(BaseModel):
    logo_text: str
    hero_title_1: str
    hero_title_2: str
    hero_title_3: str
    hero_subtitle: str
    hero_image_url: str
    hero_video_url: str
    marquee_text: str
    promo_text: str
    footer_text: str
    category_1_title: str
    category_2_title: str
    training_bg_url: str
    matchday_bg_url: str
    social_title: str
    trust_title_1: str
    trust_desc_1: str
    trust_title_2: str
    trust_desc_2: str
    about_img_1: str 
    about_img_2: str 
    show_category_split: bool
    show_social_proof: bool
    show_trust_builder: bool

class SettingsResponse(SettingsBase):
    id: int
    class Config: 
        from_attributes = True

# ==========================================
# 4. APP & ROUTES
# ==========================================
app = FastAPI(title="JERSEY PRO V5 API")

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@app.post("/api/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename.replace(' ', '_')}"
    with open(file_location, "wb+") as file_object: 
        shutil.copyfileobj(file.file, file_object)
    
    # ⚡ FIXED THIS LINE RIGHT HERE:
    return {"url": f"https://jersey-7jhu.onrender.com/{file_location}"}

# -- Products & Inventory --
@app.post("/api/products/", response_model=ProductResponse)
def create_product(p: ProductCreate, db: Session = Depends(get_db)):
    np = DBProduct(**p.model_dump())
    db.add(np)
    db.commit()
    db.refresh(np)
    return np

@app.get("/api/products/", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)): 
    return db.query(DBProduct).all()

@app.put("/api/products/{pid}", response_model=ProductResponse)
def update_product(pid: int, p: ProductCreate, db: Session = Depends(get_db)):
    dp = db.query(DBProduct).filter(DBProduct.id == pid).first()
    for k, v in p.model_dump().items(): 
        setattr(dp, k, v)
    db.commit()
    db.refresh(dp)
    return dp

@app.delete("/api/products/{pid}")
def delete_product(pid: int, db: Session = Depends(get_db)):
    db.query(DBProduct).filter(DBProduct.id == pid).delete()
    db.commit()
    return {"msg": "Deleted"}

# -- Dynamic Categories --
@app.get("/api/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(DBCategory).all()
    if not cats: 
        db.add_all([DBCategory(name="Jerseys"), DBCategory(name="Footballs")])
        db.commit()
        cats = db.query(DBCategory).all()
    return cats

@app.post("/api/categories/", response_model=CategoryResponse)
def create_category(c: CategoryCreate, db: Session = Depends(get_db)):
    nc = DBCategory(name=c.name)
    db.add(nc)
    db.commit()
    db.refresh(nc)
    return nc

@app.delete("/api/categories/{cid}")
def delete_category(cid: int, db: Session = Depends(get_db)):
    db.query(DBCategory).filter(DBCategory.id == cid).delete()
    db.commit()
    return {"msg": "Deleted"}

# -- Infinite Gallery --
@app.get("/api/gallery/", response_model=List[GalleryResponse])
def get_gallery(db: Session = Depends(get_db)): 
    return db.query(DBGallery).all()

@app.post("/api/gallery/", response_model=GalleryResponse)
def create_gallery(g: GalleryCreate, db: Session = Depends(get_db)):
    ng = DBGallery(image_url=g.image_url)
    db.add(ng)
    db.commit()
    db.refresh(ng)
    return ng

@app.delete("/api/gallery/{gid}")
def delete_gallery(gid: int, db: Session = Depends(get_db)):
    db.query(DBGallery).filter(DBGallery.id == gid).delete()
    db.commit()
    return {"msg": "Deleted"}

# -- Pages & Settings --
@app.post("/api/pages/", response_model=PageResponse)
def create_page(page: PageCreate, db: Session = Depends(get_db)):
    db_page = DBPage(**page.model_dump())
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

@app.get("/api/pages/", response_model=List[PageResponse])
def get_pages(db: Session = Depends(get_db)): 
    return db.query(DBPage).all()

@app.delete("/api/pages/{page_id}")
def delete_page(page_id: int, db: Session = Depends(get_db)):
    db.query(DBPage).filter(DBPage.id == page_id).delete()
    db.commit()
    return {"msg": "Deleted"}

@app.get("/api/settings/", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    s = db.query(DBSettings).first()
    if not s: 
        s = DBSettings()
        db.add(s)
        db.commit()
        db.refresh(s)
    return s

@app.put("/api/settings/", response_model=SettingsResponse)
def update_settings(ns: SettingsBase, db: Session = Depends(get_db)):
    s = db.query(DBSettings).first()
    if not s: 
        s = DBSettings(**ns.model_dump())
        db.add(s)
    else:
        for k, v in ns.model_dump().items(): 
            setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)