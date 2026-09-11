import asyncio
import sys
import json
import subprocess
from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig

async def solve_issue(issue):
    """Spawns an agent to solve a specific GitHub issue."""
    issue_number = issue.get("number")
    title = issue.get("title")
    body = issue.get("body")
    
    print(f"[*] Spawning worker agent for Issue #{issue_number}: {title}")
    
    # Configure the agent with capabilities to read/write files and run commands
    config = LocalAgentConfig(
        system_instructions=f"""You are a specialized worker agent assigned to fix GitHub Issue #{issue_number}.
Title: {title}
Description: {body}

Your tasks:
1. Create a new branch named 'fix/issue-{issue_number}' from 'develop'.
2. Investigate the codebase and fix the issue described.
3. Run tests to verify the fix.
4. Commit the changes using Conventional Commits (e.g., 'fix: resolve issue #{issue_number}').
5. Push the branch and create a PR using 'gh pr create' (if available) or instruct the user to do so.
""",
        capabilities=CapabilitiesConfig()
    )

    async with Agent(config) as agent:
        response = await agent.chat(f"Please begin fixing Issue #{issue_number}.")
        async for token in response:
            # We stream the tokens to stdout for visibility, though in a true background
            # swarm, we might just log them to a file.
            pass
        print(f"[+] Worker agent finished Issue #{issue_number}.")

async def main():
    print("=== @Orion Autonomous Issue Drainer ===")
    
    # 1. Fetch open issues using the GitHub CLI
    try:
        result = subprocess.run(
            ["gh", "issue", "list", "--json", "number,title,body"],
            capture_output=True,
            text=True,
            check=True
        )
        issues = json.loads(result.stdout)
    except FileNotFoundError:
        print("[!] ERROR: GitHub CLI ('gh') is not installed or not in PATH.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"[!] ERROR fetching issues: {e.stderr}")
        sys.exit(1)

    if not issues:
        print("[*] No open issues found. The backlog is clear!")
        return

    print(f"[*] Found {len(issues)} open issues. Initiating worker swarm...")

    # 2. Spawn an agent for each issue concurrently
    # Note: For safety and rate limits, you might want to batch these or limit concurrency.
    tasks = []
    for issue in issues:
        tasks.append(solve_issue(issue))

    await asyncio.gather(*tasks)
    
    print("=== Issue Swarm Completed ===")

if __name__ == "__main__":
    asyncio.run(main())
