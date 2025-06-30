from playwright.sync_api import sync_playwright

class JobSearchError(Exception):
    """Custom exception for job search errors."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

class indeedscraper:
    """
    A class to handle job search operations on Indeed.
    """

    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=True)
        self.page = self.browser.new_page() 

    def login(self, email="wemokik814@kimdyn.com", password="Jaishreeram10890"):
        loginurl = "https://secure.indeed.com/account/login"
        print("🔐 Logging into Indeed...")
        self.page.goto(loginurl, timeout=60000)
        self.page.fill('input[name="email"]', email)
        self.page.fill('input[name="password"]', password)
        self.page.click('button[type="submit"]')
        print("✍️ Filled in login credentials.")
    
    def scrape(self, job_title: str, location: str, job_type: str):
        search_query = job_title.replace(" ", "+")
        search_location = location.replace(" ", "+")
        url = f"https://www.indeed.com/jobs?q={search_query}&l={search_location}&jt={job_type}" 
        # self.login()      
        print("🔍 Starting Indeed job search...")
        jobs = []

        try:
            for i in range(5):
                self.page.goto(url, timeout=60000)
                print("🌐 Navigated to Indeed job search page.")
                self.page.wait_for_selector('.job_seen_beacon', timeout=10000)
                print("✅ Page loaded successfully, scraping jobs...")

                cards = self.page.query_selector_all('.job_seen_beacon')
                for card in cards[:10]:
                    title = card.query_selector('h2').inner_text().strip()
                    company = card.query_selector('.companyName').inner_text().strip()
                    time = None
                    time_elem = card.query_selector('.date')
                    if time_elem:
                        try:
                            time = time_elem.inner_text().strip()
                        except:
                            time = None
                    link = card.query_selector('a').get_attribute('href')
                    jobs.append({"title": title, "company": company, "link": link, "posted_time": time})

                next_page = self.page.query_selector('.pagination-list .np')
                if next_page:
                    next_page.click()
                    print("➡️ Navigating to the next page...")
                else:
                    break

            print(f"📄 Found {len(jobs)} jobs.")
            for job in jobs:
                print(f"🔗 {job['posted_time']} - {job['title']} at {job['company']} - {job['link']}")
        
        except Exception as e:
            print("⚠️ Scraping failed:", e) 