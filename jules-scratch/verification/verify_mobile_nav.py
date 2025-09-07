from playwright.sync_api import sync_playwright, Page, expect

def test_mobile_nav_drawer(page: Page):
    """
    This test verifies that the mobile navigation drawer opens and closes correctly.
    """
    # 1. Arrange: Go to the application homepage.
    page.goto("http://localhost:5176")

    # Set viewport to a mobile size
    page.set_viewport_size({"width": 375, "height": 667})

    # 2. Act: Find the menu button and click it.
    menu_button = page.get_by_role("button", name="Open menu")
    menu_button.click()

    # 3. Assert: The drawer should be visible.
    drawer = page.get_by_role("dialog", name="Mobile navigation")
    expect(drawer).to_be_visible()

    # 4. Screenshot: Capture the open drawer.
    page.screenshot(path="jules-scratch/verification/mobile_nav_open.png")

    # 5. Act: Find the close button (overlay) and click it.
    close_button = page.get_by_role("button", name="Close menu")
    close_button.click()

    # 6. Assert: The drawer should not be visible.
    expect(drawer).not_to_be_visible()

    # 7. Screenshot: Capture the closed drawer.
    page.screenshot(path="jules-scratch/verification/mobile_nav_closed.png")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_mobile_nav_drawer(page)
        browser.close()
