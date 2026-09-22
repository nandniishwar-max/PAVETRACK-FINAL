import json
import os
import uuid


DATA_FILE = "pavetrack_data.json"


def generate_id():
    return str(uuid.uuid4())


class LocalCollection:
    def __init__(self, name):
        self.name = name
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, "w") as f:
                json.dump({}, f, indent=4)

    def _load(self):
        self._ensure_file()

        with open(DATA_FILE, "r") as f:
            data = json.load(f)

        return data

    def _save(self, data):
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=4)

    def insert_one(self, document):
        data = self._load()

        document = document.copy()

        if "_id" not in document:
            document["_id"] = generate_id()

        if self.name not in data:
            data[self.name] = []

        data[self.name].append(document)

        self._save(data)

        class Result:
            inserted_id = document["_id"]

        return Result()

    def find(self, query=None):
        data = self._load()

        documents = data.get(self.name, [])

        if not query:
            return documents

        return [
            document
            for document in documents
            if self._matches(document, query)
        ]

    def find_one(self, query):
        documents = self.find(query)

        if documents:
            return documents[0]

        return None

    def update_one(self, query, update):
        data = self._load()

        documents = data.get(self.name, [])

        for document in documents:
            if self._matches(document, query):

                if "$set" in update:
                    document.update(update["$set"])

                self._save(data)

                class Result:
                    matched_count = 1
                    modified_count = 1

                return Result()

        class Result:
            matched_count = 0
            modified_count = 0

        return Result()

    def _matches(self, document, query):
        for key, value in query.items():

            if str(document.get(key)) != str(value):
                return False

        return True


class LocalDatabase:
    def __init__(self):
        self.reports = LocalCollection("reports")
        self.repairs = LocalCollection("repairs")
        self.approvals = LocalCollection("approvals")


db = LocalDatabase()

print("PaveTrack local database ready.")