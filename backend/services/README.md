# Embedding Service

Local free embeddings using `sentence-transformers`.

Setup (one-time):

```
cd backend/services
python -m venv .venv
source .venv/bin/activate
pip install -r embedding_requirements.txt
```

Run:

```
./start-embedding.sh
```

The API runs on `http://127.0.0.1:8001/embed`.
