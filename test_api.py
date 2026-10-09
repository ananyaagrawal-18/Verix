import httpx
from starlette.testclient import TestClient
from main import app

client = TestClient(app)

def test_all():
    print("--- 1. Testing /api/health ---")
    r = client.get("/api/health")
    assert r.status_code == 200
    print("Health response:", r.json())

    print("\n--- 2. Testing /api/scenarios ---")
    r = client.get("/api/scenarios")
    assert r.status_code == 200
    scenarios = r.json()
    print(f"Loaded {len(scenarios)} scenarios.")
    assert len(scenarios) == 4

    print("\n--- 3. Testing /api/products ---")
    r = client.get("/api/products")
    assert r.status_code == 200
    products = r.json()
    print(f"Loaded {len(products)} products in catalog.")
    assert len(products) >= 12

    print("\n--- 4. Testing /api/evaluate (4K Video Editor) ---")
    payload = {
        "query": "Laptop for 4K video editing Premiere and color grading under $1500"
    }
    r = client.post("/api/evaluate", json=payload)
    assert r.status_code == 200
    res = r.json()
    assert "stage_1_first_pass" in res
    assert "stage_2_red_team" in res
    assert "stage_3_reconciliation" in res
    assert "benchmark" in res
    print("Initial Product:", res["stage_1_first_pass"]["product"]["name"])
    print("Reconciled Product:", res["stage_3_reconciliation"]["final_product"]["name"])
    print("Verdict:", res["stage_3_reconciliation"]["verdict"])
    print("Confidence Shift:", res["stage_1_first_pass"]["initial_confidence"], "->", res["stage_3_reconciliation"]["final_confidence"])

    print("\n--- 5. Testing /api/reconcile-answers (Customer Answers Counter-Questions) ---")
    counter_payload = {
        "query": "Laptop for 4K video editing Premiere and color grading under $1500",
        "user_answers": {
            "workload_duration": "Sustained 4K exports / long 3D renders (> 15 mins)",
            "ram_headroom": "Yes, 16GB or 32GB is essential"
        }
    }
    r = client.post("/api/reconcile-answers", json=counter_payload)
    assert r.status_code == 200
    res_counter = r.json()
    print("Updated Verdict:", res_counter["stage_3_reconciliation"]["verdict"])
    print("Updated Final Confidence:", res_counter["stage_3_reconciliation"]["final_confidence"])

    print("\nAll API tests PASSED perfectly!")

if __name__ == "__main__":
    test_all()
