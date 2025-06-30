from playwright.sync_api import sync_playwright
from multiprocessing import Process

class JobSearchError(Exception):
    """Custom exception for job search errors."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

class LinkedInScraper:
    """
    A class to handle job search operations on LinkedIn.
    """

    def __init__(self):
        """
        Initialize the LinkedInScraper instance and Playwright browser.
        """
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=False)
        self.page = self.browser.new_page()


    def login(self, email="wemokik814@kimdyn.com", password="Jaishreeram10890"):
        loginurl = "https://www.linkedin.com/login"
        print("🔐 Logging into LinkedIn...")
        self.page.goto(loginurl, timeout=60000)
        self.page.fill('input[name="session_key"]', email)
        self.page.fill('input[name="session_password"]', password)
        self.page.click('button[type="submit"]')
        print("✍️ Filled in login credentials.")
        

    def scrape(self, selectedJobRoles, location: str, experience: str, job_type: str):
        for jobss in selectedJobRoles:
            job = jobss
            print(f"Selected job: {job}")
            search_query = job.replace(" ", "%20")
            search_location = location.replace(" ", "%20")          
            url = f"https://www.linkedin.com/jobs/search/?keywords={search_query}&location={search_location}&f_JT={job_type}"
            #self.login()

            print("🔍 Starting LinkedIn job search...")
            jobs = []

            try:
                for i in range(5):
                    self.page.goto(url, timeout=60000)
                    self.page.wait_for_selector('.base-card', timeout=10000)
                    print("🌐 Navigated to LinkedIn job search page.")
                    #self.page.wait_for_selector('.base-card', timeout=10000)
                    print("✅ Page loaded successfully, scraping jobs...")

                    cards = self.page.query_selector_all('.base-card')
                    for card in cards[:10]:
                        title = card.query_selector('h3').inner_text().strip()
                        company = card.query_selector('h4').inner_text().strip()
                        time = None
                        # Try to get the posted time from the job card first
                        time = None
                        time_elem = card.query_selector('time')
                        if time_elem:
                            try:
                                time = time_elem.inner_text().strip()
                            except:
                                time = None
                        # If not found, try to get it from the job details section
                        if not time:
                            job_link = card.query_selector('a').get_attribute('href')
                            if job_link:
                                # Open job details in a new tab to avoid losing the main search page
                                detail_page = self.browser.new_page()
                                detail_page.goto(job_link, timeout=60000)
                                try:
                                    detail_selector = 'div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details'
                                    detail_page.wait_for_selector(detail_selector, timeout=10000)
                                    time_elem = detail_page.query_selector(f"{detail_selector} time")
                                    if time_elem:
                                        time = time_elem.inner_text().strip()
                                except:
                                    pass
                                detail_page.close()
                        link = card.query_selector('a').get_attribute('href')
                        jobs.append({"title": title, "company": company, "link": link, "posted_time": time})

                    next_page = self.page.query_selector('.jobs-search-pagination__button--next')
                    if next_page:
                        next_page.click() 

                    print(f"📄 Found {len(jobs)} jobs.")
                    for job in jobs:
                        print(f"🔗 {job['posted_time'] ,job['title']} at {job['company']} - {job['link']}")

            except Exception as e:
                print("⚠️ Scraping failed:", e)
        self.close()


    def close(self):
        self.page.close()
        self.browser.close()
        self.playwright.stop()

# --- Subprocess wrapper ---
def run_scraper(*args, **kwargs):
    scraper = LinkedInScraper()
    scraper.scrape(*args, **kwargs)

if __name__ == "__main__":
    # Standalone script usage
    run_scraper(["Software Engineer", "Data Analyst"], "San Francisco", "3 Yrs", "Full-Time")
else:
    # If imported (e.g. by FastAPI), expose a function to run in a subprocess
    def run_linkedin_scraper(selectedJobRoles, location, experience, job_type):
        p = Process(target=run_scraper, args=(selectedJobRoles, location, experience, job_type))
        p.start()
        p.join()