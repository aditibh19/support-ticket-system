# tickets/llm.py
import os
import json
import time
from openai import OpenAI
from requests.exceptions import RequestException

def classify_ticket_description(description: str) -> dict:
    prompt = f"""
You are a support ticket classifier.

Categories: billing, technical, account, general
Priorities: low, medium, high, critical

Return ONLY valid JSON like:
{{
  "suggested_category": "...",
  "suggested_priority": "..."
}}

Ticket description:
{description}
"""
    retries = 3
    delay = 2  # seconds

    for attempt in range(retries):
        try:
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                timeout=10,  # timeout for LLM request
            )
            result = response.choices[0].message.content.strip()
            parsed = json.loads(result)
            return parsed

        except (RequestException, json.JSONDecodeError, Exception) as e:
            print(f"LLM classify failed (attempt {attempt+1}):", e)
            time.sleep(delay)

    # fallback after retries
    return {"suggested_category": "general", "suggested_priority": "medium"}