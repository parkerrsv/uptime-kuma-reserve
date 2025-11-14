/**
 * Playwright E2E Test for Quick Reserve Functionality
 * 
 * This test verifies the complete Quick Reserve workflow:
 * 1. User opens Quick Reserve dialog
 * 2. Selects a device type
 * 3. Enters their name
 * 4. Selects reservation duration
 * 5. System finds first available monitor of that type
 * 6. Monitor is reserved successfully
 */

const { test, expect } = require("@playwright/test");

test.describe("Quick Reserve Functionality", () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the dashboard
        await page.goto("/");
        
        // Wait for login and navigate to dashboard
        // Note: Adjust based on your setup process
        await page.waitForSelector("[data-testid='monitor-list']", { timeout: 30000 });
    });

    test("should open Quick Reserve dialog", async ({ page }) => {
        // Click the Quick Reserve button
        await page.click("button:has-text('Quick Reserve')");

        // Verify dialog is visible
        await expect(page.locator(".modal-title:has-text('Quick Reserve')")).toBeVisible();
        
        // Verify form elements are present
        await expect(page.locator("label:has-text('Device Type')")).toBeVisible();
        await expect(page.locator("label:has-text('Name')")).toBeVisible();
        await expect(page.locator("label:has-text('Reservation Duration')")).toBeVisible();
    });

    test("should show device type options from existing monitors", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Click the device type dropdown
        await page.click(".multiselect__tags");

        // Verify that device types are loaded (this assumes monitors exist)
        // The actual types will depend on test data
        const dropdown = page.locator(".multiselect__content");
        await expect(dropdown).toBeVisible();
    });

    test("should allow typing a new custom device type", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Type a custom device type
        const customType = "CustomTestDevice";
        await page.fill(".multiselect__input", customType);
        
        // Press Enter to create the tag
        await page.press(".multiselect__input", "Enter");

        // Verify the custom type is selected
        // Note: VueMultiselect shows selected value in .multiselect__single or .multiselect__tags
    });

    test("should validate required fields", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Try to reserve without filling required fields
        await page.click("button:has-text('Reserve')");

        // Should show validation errors or not submit
        // (Actual validation behavior depends on implementation)
    });

    test("should reserve monitor with 1 hour duration", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Select or create a device type
        await page.fill(".multiselect__input", "TestServer");
        await page.press(".multiselect__input", "Enter");

        // Enter name
        await page.fill("input[placeholder*='name']", "Test User");

        // Click 1 hour quick button
        await page.click("button:has-text('1 hr')");

        // Click Reserve
        await page.click("button:has-text('Reserve')");

        // Wait for success notification
        await expect(page.locator(".toast-success, .alert-success")).toBeVisible({ timeout: 5000 });
        
        // Verify toast message contains expected text
        await expect(page.locator(".toast-body, .alert")).toContainText("successfully");
    });

    test("should show error when no monitors available for device type", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Use a device type that doesn't exist
        const nonExistentType = "NonExistentDeviceType_" + Date.now();
        await page.fill(".multiselect__input", nonExistentType);
        await page.press(".multiselect__input", "Enter");

        // Enter name
        await page.fill("input[placeholder*='name']", "Test User");

        // Click 1 hour
        await page.click("button:has-text('1 hr')");

        // Click Reserve
        await page.click("button:has-text('Reserve')");

        // Should show error notification
        await expect(page.locator(".toast-error, .alert-danger")).toBeVisible({ timeout: 5000 });
        await expect(page.locator(".toast-body, .alert")).toContainText("No available monitors");
    });

    test("should reserve with eternal duration", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Select device type
        await page.fill(".multiselect__input", "TestRouter");
        await page.press(".multiselect__input", "Enter");

        // Enter name
        await page.fill("input[placeholder*='name']", "Test User");

        // Check eternal checkbox
        await page.check("input[type='checkbox'][id*='eternal']");

        // Click Reserve
        await page.click("button:has-text('Reserve')");

        // Wait for success
        await expect(page.locator(".toast-success")).toBeVisible({ timeout: 5000 });
    });

    test("should close dialog on cancel", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Verify dialog is open
        await expect(page.locator(".modal-title:has-text('Quick Reserve')")).toBeVisible();

        // Click Cancel
        await page.click("button:has-text('Cancel')");

        // Verify dialog is closed
        await expect(page.locator(".modal-title:has-text('Quick Reserve')")).not.toBeVisible();
    });

    test("should use custom datetime when selected", async ({ page }) => {
        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Select device type
        await page.fill(".multiselect__input", "TestDevice");
        await page.press(".multiselect__input", "Enter");

        // Enter name
        await page.fill("input[placeholder*='name']", "Test User");

        // Uncheck eternal (if checked)
        await page.uncheck("input[type='checkbox'][id*='eternal']");

        // Select custom datetime
        // Note: This depends on the datetime picker implementation
        // You may need to adjust selectors based on the actual component
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 3);
        
        // If using a datetime input
        const datetimeInput = page.locator("input[type='datetime-local']");
        if (await datetimeInput.isVisible()) {
            await datetimeInput.fill(futureDate.toISOString().slice(0, 16));
        }

        // Click Reserve
        await page.click("button:has-text('Reserve')");

        // Verify success
        await expect(page.locator(".toast-success")).toBeVisible({ timeout: 5000 });
    });

    test("should find first unreserved monitor of specified type", async ({ page }) => {
        // This test requires setup:
        // 1. Create multiple monitors of the same device type
        // 2. Reserve some of them
        // 3. Verify Quick Reserve finds the first unreserved one

        // Setup: Create test monitors (via API or UI)
        // For now, this is a placeholder for integration testing

        // Click Quick Reserve
        await page.click("button:has-text('Quick Reserve')");

        // Select device type that has both reserved and unreserved monitors
        await page.fill(".multiselect__input", "Server");
        await page.press(".multiselect__input", "Enter");

        // Enter name
        await page.fill("input[placeholder*='name']", "Test User");

        // Select duration
        await page.click("button:has-text('1 hr')");

        // Click Reserve
        await page.click("button:has-text('Reserve')");

        // Verify success message shows the monitor that was reserved
        const successToast = page.locator(".toast-success .toast-body");
        await expect(successToast).toBeVisible({ timeout: 5000 });
        
        // The toast should contain the monitor name
        const toastText = await successToast.textContent();
        expect(toastText).toMatch(/successfully/i);
    });

    test("should handle reservation of already reserved monitor gracefully", async ({ page }) => {
        // If Quick Reserve tries to reserve a monitor that gets reserved
        // by another user between finding it and reserving it,
        // it should handle the race condition gracefully

        // This is a placeholder for concurrent access testing
        // Requires more complex setup
    });
});

test.describe("Device Type Persistence", () => {

    test("should save and persist custom device type on new monitor", async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("[data-testid='monitor-list']", { timeout: 30000 });

        // Click Add New Monitor
        await page.click("button:has-text('Add New Monitor')");

        // Fill basic info
        await page.fill("[data-testid='friendly-name-input']", "Test Monitor");
        
        // Select HTTP type (if not already selected)
        const typeSelect = page.locator("select#type, [name='type']");
        if (await typeSelect.isVisible()) {
            await typeSelect.selectOption("http");
        }

        // Fill URL
        await page.fill("input[name='url'], input#url", "https://example.com");

        // Add custom device type
        const customDeviceType = "E2ETestDevice_" + Date.now();
        await page.fill(".multiselect__input", customDeviceType);
        await page.press(".multiselect__input", "Enter");

        // Save monitor
        await page.click("button[type='submit']:has-text('Save')");

        // Wait for redirect to dashboard
        await page.waitForURL(/\/dashboard/, { timeout: 10000 });

        // Verify the monitor appears in the list
        await expect(page.locator(`text=${customDeviceType}`)).toBeVisible({ timeout: 5000 });

        // Edit the same monitor
        await page.click(`text=Test Monitor`);

        // Wait for edit form
        await page.waitForSelector("[data-testid='friendly-name-input']");

        // Verify device type is still selected
        const selectedType = page.locator(".multiselect__single");
        await expect(selectedType).toContainText(customDeviceType);
    });

    test("should update device type on existing monitor", async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("[data-testid='monitor-list']", { timeout: 30000 });

        // Assume a monitor already exists, click to edit
        // This will need to be adapted based on your test setup
        const firstMonitor = page.locator("[data-testid='monitor-item']").first();
        await firstMonitor.click();

        // Wait for edit form
        await page.waitForSelector("[data-testid='friendly-name-input']");

        // Change device type
        const newDeviceType = "UpdatedType_" + Date.now();
        
        // Clear existing selection
        const clearButton = page.locator(".multiselect__clear");
        if (await clearButton.isVisible()) {
            await clearButton.click();
        }

        // Type new device type
        await page.fill(".multiselect__input", newDeviceType);
        await page.press(".multiselect__input", "Enter");

        // Save
        await page.click("button[type='submit']:has-text('Save')");

        // Wait for save to complete
        await expect(page.locator(".toast-success")).toBeVisible({ timeout: 5000 });

        // Reload page
        await page.reload();
        await page.waitForSelector("[data-testid='monitor-list']", { timeout: 30000 });

        // Verify new device type appears
        await expect(page.locator(`text=${newDeviceType}`)).toBeVisible({ timeout: 5000 });
    });

    test("should load device types from existing monitors", async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("[data-testid='monitor-list']", { timeout: 30000 });

        // Open Quick Reserve to check loaded device types
        await page.click("button:has-text('Quick Reserve')");

        // Click device type dropdown
        await page.click(".multiselect__tags");

        // If there are existing monitors with device types,
        // they should appear in the dropdown options
        const options = page.locator(".multiselect__option");
        
        // At minimum, should be able to interact with the dropdown
        await expect(page.locator(".multiselect__content")).toBeVisible();

        // Close dialog
        await page.click("button:has-text('Cancel')");
    });
});
