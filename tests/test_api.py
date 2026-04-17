from fastapi.testclient import TestClient

from database import Dokuman, SessionLocal
from main import app


client = TestClient(app)


def _cleanup_test_docs() -> None:
    db = SessionLocal()
    try:
        db.query(Dokuman).filter(Dokuman.dosya_adi.like("test_%")).delete()
        db.commit()
    finally:
        db.close()


def test_root_returns_active_status() -> None:
    response = client.get("/")

    assert response.status_code == 200
    body = response.json()
    assert body["durum"] == "aktif"


def test_upload_and_list_document() -> None:
    _cleanup_test_docs()

    response = client.post(
        "/upload/",
        files={"dosya": ("test_upload.txt", b"Bu bir test dosyasidir.", "text/plain")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert "id" in payload
    assert payload["dosya_adi"] == "test_upload.txt"

    list_response = client.get("/upload/listele")
    assert list_response.status_code == 200
    listed_docs = list_response.json()["veriler"]
    assert any(doc["dosya_adi"] == "test_upload.txt" for doc in listed_docs)

    _cleanup_test_docs()


def test_search_requires_minimum_length() -> None:
    response = client.get("/search/", params={"kelime": "a"})
    assert response.status_code == 400
    assert "en az 2 karakter" in response.json()["detail"]
