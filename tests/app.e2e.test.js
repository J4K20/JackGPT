import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test("page loads with JackGPT title", async ({ page }) => {
  await expect(page.locator("h1")).toHaveText("JackGPT");
});

test("shows import prompt when no conversation is selected", async ({
  page,
}) => {
  await expect(page.locator(".import-div")).toBeVisible();
});

test("new chat button clears the current conversation", async ({ page }) => {
  await page.locator(".message-input").fill("Hello");
  await page.locator(".send-button").click();
  await page.locator(".wide-button", { hasText: "New Chat" }).click();
  await expect(page.locator(".import-div")).toBeVisible();
});

test("sends a message and receives a response", async ({ page }) => {
  await page.locator(".message-input").fill("Say the word hello");
  await page.locator(".send-button").click();
  await expect(page.locator(".message.user").first()).toBeVisible();
  await expect(page.locator(".message.assistant").first()).toBeVisible({
    timeout: 10000,
  });
});

test("conversation appears in sidebar after first message", async ({
  page,
}) => {
  await page.locator(".message-input").fill("Test conversation");
  await page.locator(".send-button").click();
  await expect(page.locator(".past-chat").first()).toBeVisible({
    timeout: 10000,
  });
});

test("opens and closes settings modal", async ({ page }) => {
  await page.locator(".settings-button").click();
  await expect(page.locator(".modal-content")).toBeVisible();
  await page.locator(".close-button").click();
  await expect(page.locator(".modal-content")).not.toBeVisible();
});

test("sidebar can be hidden via settings", async ({ page }) => {
  await page.locator(".settings-button").click();
  const sidebarCheckbox = page
    .locator("label")
    .filter({ hasText: "Sidebar" })
    .locator("input[type='checkbox']");
  if (await sidebarCheckbox.isChecked()) {
    await sidebarCheckbox.uncheck();
  }
  await page.locator(".save-button").click();
  await expect(page.locator(".sidebar")).not.toBeVisible();
});

test("can rename a conversation", async ({ page }) => {
  await page.locator(".message-input").fill("Rename test");
  await page.locator(".send-button").click();
  await page.locator(".past-chat").first().hover();
  await page.locator(".chat-rename-icon").first().click();
  await page.locator(".rename-input").fill("My Renamed Chat");
  await page.keyboard.press("Enter");
  await expect(page.locator(".chat-name").first()).toHaveText(
    "My Renamed Chat",
  );
});

test("can delete a conversation", async ({ page }) => {
  await page.locator(".message-input").fill("Delete me");
  await page.locator(".send-button").click();
  await expect(page.locator(".past-chat").first()).toBeVisible({
    timeout: 10000,
  });
  await page.locator(".delete-button").click();
  await expect(page.locator(".import-div")).toBeVisible();
});
