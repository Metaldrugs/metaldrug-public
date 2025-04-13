import csv
import datetime

NDA_CSV_PATH = "C:\\Users\\Kunfirm\\Downloads\\MDC_Root\\Moleculogic\\Tier0_Public\\nda-submissions.csv"

def read_submissions():
    with open(NDA_CSV_PATH, newline='', encoding='utf-8') as csvfile:
        return list(csv.DictReader(csvfile))

def list_pending():
    submissions = read_submissions()
    return [sub for sub in submissions if sub.get("status", "").lower() == "pending"]

def approve_submission(index, reviewer_name):
    rows = read_submissions()
    if 0 <= index < len(rows):
        rows[index]["status"] = "approved"
        rows[index]["review_date"] = datetime.datetime.now().isoformat()
        rows[index]["approved_by"] = reviewer_name

        with open(NDA_CSV_PATH, mode='w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        print(f"✅ Approved submission #{index + 1} by {reviewer_name}")
    else:
        print("❌ Invalid submission index.")

def print_summary():
    for i, sub in enumerate(read_submissions()):
        print(f"[{i+1}] {sub['name']} ({sub['email']}) - {sub['status']} - {sub['timestamp']}")

if __name__ == "__main__":
    print("Moleculogic NDA Submission Panel")
    print("-" * 40)
    print_summary()
