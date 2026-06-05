import os
import shutil
import uuid


def save_resume(
        file,
        user_id: int,
):
    extension = os.path.splitext(
        file.filename
    )[1]

    filename = (
        f"{uuid.uuid4()}{extension}"
    )

    # Create directory if it doesn't exist
    os.makedirs("uploads/resumes", exist_ok=True)

    file_path = os.path.join(
        "uploads",
        "resumes",
        filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    return file_path