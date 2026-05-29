from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

Sentiment = Literal["positive", "neutral", "negative"]
Status = Literal["new", "reviewing", "done"]


class FeedbackCreate(BaseModel):
    message: str = Field(..., min_length=1)
    email: Optional[str] = None


class FeedbackUpdate(BaseModel):
    sentiment: Optional[Sentiment] = None
    status: Optional[Status] = None

    @model_validator(mode="after")
    def require_at_least_one_field(self) -> "FeedbackUpdate":
        if self.sentiment is None and self.status is None:
            raise ValueError("At least one of sentiment or status must be provided.")
        return self


class FeedbackResponse(BaseModel):
    id: int
    message: str
    email: Optional[str]
    sentiment: Optional[Sentiment]
    status: Status
    created_at: datetime
