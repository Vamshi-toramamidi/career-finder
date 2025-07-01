from playwright.sync_api import sync_playwright
from scraper.linkedin import LinkedInScraper


class scraper:
    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=False)
        self.page = self.browser.new_page()

    def callscraper(self, job_title: str, location: str, experience: str, job_type: str):
        LinkedInScraper = LinkedInScraper().scrape(job_title, location, experience, job_type)
        indeedscraper = indeedscraper().scrape(job_title,location,experience, job_type)  # Placeholder for Indeed scraper
