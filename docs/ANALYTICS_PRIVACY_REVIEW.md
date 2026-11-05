# Analytics Privacy Review (internal)

Not published on the website. Backs up the public-facing language in [privacy.html](../privacy.html) (last updated November 5, 2026) with the technical detail that policy intentionally leaves out.

## What's in place

- **Vendor:** PostHog, used for product analytics in the TripQuest iOS/iPadOS app.
- **Hosting:** PostHog's US-hosted (posthog.com) infrastructure, not EU-hosted.
- **Data categories collected:** app usage events — which games/modes are played, completion rates, feature engagement, and basic device/technical metadata (device type, OS version, app version). An anonymous, device-generated identifier is used to distinguish devices across sessions; it is not tied to a player name, email, or account (TripQuest has no accounts).
- **Not collected via analytics:** personal game responses/content entered by players, precise GPS location or travel routes, contacts, photos, microphone audio, or payment card details.
- **Session recording:** disabled.
- **In-app purchases:** purchase *events* (that a purchase occurred, which pack) may be visible to analytics; payment processing itself is handled entirely by Apple/StoreKit and PostHog never receives card details.

## Needs verification before relying on it further

These are stated cautiously or omitted from the public policy because they could not be confirmed from the website repo (the iOS app's analytics implementation lives in a separate codebase not available in this session):

1. **IP address handling.** Confirm whether PostHog is configured to anonymize/discard IP addresses server-side, or whether raw IPs are retained and for how long. The public policy avoids claiming IPs are "never collected."
2. **Device identifier persistence.** Confirm whether the anonymous device ID is stable across app reinstalls/updates (PostHog's default `distinct_id` behavior) and whether it resets on app deletion.
3. **Data retention period.** Confirm PostHog project retention settings (default vs. custom) so a concrete retention statement can be added if desired.
4. **Deletion/opt-out mechanism.** No in-app analytics toggle or self-service deletion flow is confirmed to exist. The public policy only commits to handling deletion/opt-out *requests* via support email — do not add language promising an in-app opt-out switch unless one is actually built and verified.
5. **Apple App Privacy ("nutrition label") declarations.** The App Store Connect privacy declarations should be reviewed/updated to list the "Usage Data" and "Identifiers" categories collected via PostHog, linked to the app, not used for tracking (assuming no cross-app/cross-site tracking is configured). Verify this matches PostHog's actual SDK configuration (e.g., whether IDFA or any tracking-linked identifier is used — if so, ATT prompts and "Data Used to Track You" disclosures would be required instead).
6. **Kids Category / children's privacy rules.** TripQuest is family-friendly but the policy does not claim COPPA compliance or Kids Category status. If the app is ever submitted under Apple's Kids Category, analytics SDKs with persistent identifiers are restricted or prohibited under Apple's kids category guidelines, and COPPA has its own analytics/persistent-identifier restrictions for apps directed at children under 13. This needs a dedicated legal/compliance review before any Kids Category submission; do not assume the current PostHog setup is compliant with those stricter rules.
7. **Consent requirements by region.** Depending on where the app is distributed, some analytics configurations (e.g., EU users) may require consent before any analytics SDK initializes. Confirm whether PostHog initialization is gated behind any consent step, or whether it's a "legitimate interest" / anonymous-usage-only configuration that doesn't require a consent prompt.

## Why the public policy is worded the way it is

- Does not name PostHog (per product preference); says "a trusted third-party analytics service."
- Avoids technical terms (tracking, profiling, behavioral analytics, conversion funnels).
- Does not claim full anonymity, since a persistent anonymous identifier is used — instead it describes what the identifier is used for (counting devices) and what it's not tied to (a name or account).
- Does not promise an opt-out toggle or specific deletion timeline that isn't confirmed to exist; instead it directs privacy requests to support email, consistent with the rest of the existing policy's contact-based approach.
