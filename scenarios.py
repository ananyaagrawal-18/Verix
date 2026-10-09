"""
Pre-packaged Hackathon Judge Scenarios for Veritas Tech
Demonstrates real-world cases where single-pass AI fails and double-check AI saves the buyer.
"""

from typing import List, Dict, Any

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario-video-editor",
        "tag": "Creative Pro",
        "title": "The 4K Video Editor Trap",
        "badge": "CHANGED (Caught Thermal & RAM Swap Flaw)",
        "icon": "Video",
        "user_query": "Hey, I need a laptop for editing YouTube videos in 4K DaVinci Resolve and color grading. Budget around $1200 - $1500.",
        "description": "Standard AI recommends a base MacBook Air because 'Apple Silicon is great for media'. Veritas challenges it for fanless thermal throttling and 8GB memory paging, pivoting to an OLED creator rig with dedicated RTX GPU.",
        "simulated_answers": {
            "workload_duration": "Sustained 4K exports / long 3D renders (> 15 mins)",
            "ram_headroom": "Yes, 16GB or 32GB is essential",
            "display_color": "Critical: 100% sRGB or DCI-P3 for photo/video/design"
        }
    },
    {
        "id": "scenario-cs-student",
        "tag": "College / Gaming",
        "title": "The College CS Student Dilemma",
        "badge": "CHANGED (Caught Campus Portability & Battery Flaw)",
        "icon": "GraduationCap",
        "user_query": "I am entering my 1st year of Computer Science in college. I need to write code all day and play games like Cyberpunk on weekends. Budget around $1400.",
        "description": "Standard AI recommends a 2.5kg gaming brick with 3-hour battery. Veritas red-teams the mobility and classroom battery realities, pivoting to a sleek 1.5kg laptop with 8.5 hours of battery and USB-C charging.",
        "simulated_answers": {
            "mobility_priority": "Must last 7+ hours in lectures/travel without a charger (< 1.6kg)"
        }
    },
    {
        "id": "scenario-executive-travel",
        "tag": "Business Executive",
        "title": "The Road Warrior Stress-Test",
        "badge": "AGREES (Robust Scrutiny Confirmed)",
        "icon": "Briefcase",
        "user_query": "I need the absolute best ultralight business laptop for frequent flights, board meetings, and spreadsheets. Must be durable and under 1.2kg. Budget up to $2000.",
        "description": "Veritas proposes the ThinkPad X1 Carbon Gen 12, red-teams its lack of dGPU and soldered RAM against corporate usage, and verifies that the initial pick is indeed optimal.",
        "simulated_answers": {}
    },
    {
        "id": "scenario-budget-ml",
        "tag": "AI Engineering",
        "title": "The Budget Machine Learning Paradox",
        "badge": "UNCERTAIN (Caught Guaranteed OOM Crash)",
        "icon": "Brain",
        "user_query": "I want to train deep learning models and fine-tune open-source LLMs locally on my laptop, but my strict budget is under $750.",
        "description": "Standard AI blindly recommends a $699 budget gaming laptop with 6GB VRAM. Veritas red-teams the mathematical impossibility of local LLM training on 6GB VRAM, drops confidence to 42%, and flags an UNCERTAIN state with human decision options.",
        "simulated_answers": {}
    }
]

def get_all_scenarios() -> List[Dict[str, Any]]:
    return SCENARIOS

def get_scenario_by_id(scenario_id: str) -> Dict[str, Any]:
    for s in SCENARIOS:
        if s["id"] == scenario_id:
            return s
    return SCENARIOS[0]
