from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

Sentiment = Literal["positive", "neutral", "negative"]
Status = Literal["new", "reviewing", "done"]


class FeedbackCreate(BaseModel):
    message: str = Field(..., min_length=1)
    email: Optional[str] = None


class FeedbackUpdate(BaseModel):
    sentiment: Optional[Sentiment] = None
    status: Optional[Status] = None


class FeedbackResponse(BaseModel):
    id: int
    message: str
    email: Optional[str]
    sentiment: Optional[Sentiment]
    status: Status
    created_at: datetime
