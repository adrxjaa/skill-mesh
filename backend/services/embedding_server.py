from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()
model = SentenceTransformer("all-mpnet-base-v2")


class EmbedRequest(BaseModel):
    text: str


@app.post("/embed")
def embed(req: EmbedRequest):
    text = req.text or ""
    vector = model.encode([text], normalize_embeddings=True)[0]
    return {"embedding": vector.tolist()}
