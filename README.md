# Portfolio Telegram Analytics

Read-only Telegram analytics bot for portfolio snapshots. Users upload a CSV, queue analysis, and receive a text summary plus charts. A worker processes jobs from SQLite, and an optional weekly summary can be sent on a schedule.

## Features

- Upload position snapshots via Telegram (`.csv` file attachment).
- Queue and run analytics jobs asynchronously.
- Compute portfolio and benchmark metrics over a trailing window (default 3 months).
- Compare against `SPY` and `IWM`.
- Perform TSLA concentration check and a static TSLA rebalance scenario.
- Generate charts: cumulative return and drawdown.
- Send weekly summary messages to opted-in users.

## Project Layout

- `src/portfolio_app/telegram_bot.py` - Telegram command handlers and upload flow.
- `src/portfolio_app/worker.py` - Background job processor and chart generation.
- `src/portfolio_app/weekly.py` - Weekly summary sender.
- `src/portfolio_app/migrate.py` - DB table bootstrap (`create_all`).
- `scripts/` - Convenience launch scripts.
- `deploy/systemd/` - Service and timer units for Linux deployment.

## Requirements

- Python 3.10+
- Telegram bot token
- SQLite (default) or another SQLAlchemy-compatible database
- Linux/systemd only if you want managed background services

Python dependencies are listed in `requirements.txt`.

## Quick Start (Local)

1. **Create and activate a virtual environment**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. **Create `.env` from example**

```bash
cp .env.example .env
```

3. **Set required values in `.env`**

- `TELEGRAM_BOT_TOKEN=<your_token>`
- `DATABASE_URL=sqlite:////opt/portfolio-telegram-analytics/var/app.sqlite3` (or your preferred DB URL)

4. **Create runtime directories**

```bash
mkdir -p /opt/portfolio-telegram-analytics/var/uploads
mkdir -p /opt/portfolio-telegram-analytics/var/reports
mkdir -p /opt/portfolio-telegram-analytics/var/cache
```

5. **Initialize DB tables**

```bash
export PYTHONPATH=src
python -m portfolio_app.migrate
```

6. **Run bot + worker (two terminals)**

```bash
export PYTHONPATH=src
python -m portfolio_app.telegram_bot
```

```bash
export PYTHONPATH=src
python -m portfolio_app.worker
```

## Telegram Commands

- `/start` - Intro and required CSV columns.
- `/help` - Command help.
- `/upload` - Upload instructions.
- Upload CSV as a document attachment.
- `/run` - Queue analytics on the latest upload.
- `/report` - Fetch latest job result and charts.
- `/weekly on` / `/weekly off` - Enable/disable weekly summary.

Required CSV columns:

- `as_of_date`
- `ticker`
- `quantity`
- `price`
- `market_value`

## Analytics Output

Each analysis run reports:

- Portfolio return, annualized volatility, max drawdown, Sharpe.
- Benchmark metrics for `SPY` and `IWM`.
- TSLA concentration metrics.
- Rebalanced scenario (TSLA shares reduced by 25%, cash redistributed pro-rata).
- Warnings/notes about data quality or missing market data.
- PNG charts saved under `REPORT_DIR/job_<id>/`.

## Environment Variables

See `.env.example` for the complete list. Common values:

- `TELEGRAM_BOT_TOKEN`
- `DATABASE_URL`
- `BASE_DIR`, `VAR_DIR`, `UPLOAD_DIR`, `REPORT_DIR`, `CACHE_DIR`
- `RISK_FREE_RATE_ANNUAL` (default in code: `0.03`)
- `BENCHMARK_SP500` (default `SPY`)
- `BENCHMARK_R2000` (default `IWM`)
- `HISTORY_MONTHS` (default `3`)
- `MAX_UPLOAD_MB` (default `10`)

Optional OpenClaw hooks:

- `OPENCLAW_HOOKS_URL`
- `OPENCLAW_HOOKS_TOKEN`
- `OPENCLAW_HOOKS_AGENTID`
- `OPENCLAW_HOOKS_DELIVER`
- `OPENCLAW_HOOKS_CHANNEL`
- `OPENCLAW_HOOKS_TO`

## Running With Scripts

Scripts in `scripts/` activate `.venv`, run migrations, then start each process:

- `scripts/run_bot.sh`
- `scripts/run_worker.sh`
- `scripts/run_weekly.sh`

If you use these scripts, ensure the environment has module resolution for `src` (for example, `PYTHONPATH=src`).

## systemd Deployment (Ubuntu)

Unit files are in `deploy/systemd/`.

Install:

```bash
sudo cp deploy/systemd/portfolio-*.service /etc/systemd/system/
sudo cp deploy/systemd/portfolio-weekly.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-bot.service
sudo systemctl enable --now portfolio-worker.service
sudo systemctl enable --now portfolio-weekly.timer
```

Logs:

```bash
journalctl -u portfolio-bot.service -f
journalctl -u portfolio-worker.service -f
journalctl -u portfolio-weekly.service -f
```

Weekly timer default:

- `OnCalendar=Sun *-*-* 20:00:00` (Sunday at 20:00, server local time)

## Notes

- The worker excludes benchmark tickers from holdings if they appear in the uploaded CSV, because benchmarks are compared separately.
- The system is read-only analytics: no brokerage integration or order execution.

