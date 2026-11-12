# Wine With Pete — Photographic Release 3 recovery and art-direction gate

**Planning/recovery only.** Not a private-media export, publication approval, or a release commitment. Current public site: production `42b4ada`. Mobile + Explore integration is independently review-only. Source work for photographic Explore remains [PR #12](https://github.com/peterpielaetstrayer/winewithpete/pull/12), original branch `work/explore-photographic-v03` commit `342f869a0ba04057bf840f1295c957c3b127b21d`.

## Why this matters

The site should feel like an *authored hospitality journal*: photographs of actual meals, the author's actions, real spaces, tools, preparation, and shared experiences. Do not stage generic upscale dinner-party claims or treat imagined dishes as proof that Peter made them. The photographs are a source of trust and specificity, not background decoration.

## Recovered prior photographic design

The existing v0.3 contains an editorial full-bleed Explore hero, four functional Cook/Taste/Gather/Stories entryways, behind-the-scenes feature, three vignettes, and a single event-specific Seoul Bowl catalog cover. Its no-photo mode uses safe gradient covers and still works; legacy feature flag `NEXT_PUBLIC_WWP_EXPLORE_PHOTOS` defaults OFF. Old branch derives from pre-release Explore, so do **not** merge it wholesale into new secure combined Explore.

Prior **private review artifacts** were `Wine_With_Pete_Explore_v0.3_Private_Photos.zip` (eight optimized WebP images) and `Wine_With_Pete_Explore_v0.3_Private_Photo_Review.html` (self-contained HTML design preview). The HTML has a private Library record, but original bytes could not be materially retrieved in the current connector session; do not claim a successful reinspection or use of its image contents. Original images remain outside public GitHub.

### Historical image-role candidates, not approved publication

| Private derivative basename | Draft role | Verification before use |
|---|---|---|
| `hero-seoul-bowl.webp` | Full-bleed Explore hero; Seoul Bowl event cover | Confirm precise event/photo match, people in frame, caption and consent |
| `from-fire.webp` | Cooking fire / process vignette | Identify depicted cooking method, source and public-release status |
| `wine-table.webp` | Taste / wine vignette | Confirm wine labels, factual context and permissions |
| `set-table.webp` | Hospitality preparation | Check venue and guest identifiers |
| `work-service.webp` | Real hands/service scene | Consent for any identifiable people |
| `ingredients.webp` | Behind-the-scenes mise en place | Confirm actual pictured recipe/event, ingredient truth |
| `fire-wings.webp` | Possibly cooking/fire visual | **Do not** imply it depicts the published Chipotle Lime Fire Wings unless verified |
| `outside-cheese.webp` | Outdoor ingredient/cheese detail | Confirm actual context, exposure and rights |

Prior note: Peter confirmed ownership/authorship of supplied photographs and authorized creative **review** on Oct 28; that was not blanket permission to publicly release private guest images. Check rights and individuals separately.

## Draft image placement decisions to review

1. Homepage: choose a genuine *human, food-sharing* image for one major editorial moment if privacy/rights allow. Do not replace the thesis with a fabricated dinner photo. Preserve a readable text overlay on phone and desktop.
2. Explore: port the selected PR #12 photographic layout **onto the exact reviewed combined Release 2 code**, keeping live search, filters, card links and safe default behavior.
3. Table Archive: prefer verified, event-specific photographs with dates/menus; if unavailable, use text-first covers rather than unrelated photos.
4. Recipes: only use photographs showing the actual prepared recipe or clearly labeled process context. If there is no verified Chipotle Lime Wings photo, keep the generic fire hero as decorative and use typographic coverage.
5. About/Journal: select at most a few original scenes with story/captions; avoid overusing one campfire image everywhere.

## Privacy / publication decision per asset

Before any hosted media: photographer/creator verified; visible guest consent where needed; location, captions and event context verified; absence of sensitive documents/names/license plates; personal metadata removed; crop tested at 390px and 1366px; alt text accurate; export size/format checked; explicit owner approval for exact public variants. The public repo should remain photo-free unless owner explicitly approves a licensed delivery approach. Public CDN URLs are still **public**; they must not contain photos that require secrecy.

## Release 3 gate

After Explore + polish release is approved and stabilized, prepare a **separate review-only photographic design PR** that ports only the PR #12 layout/components and preserves disabled safe mode by default. Do not switch on real-photo mode or upload the eight originals/derivatives until the selected asset manifest and permissions are approved. Require phone/desktop keyboard/filter/image-crop tests, visual review, and one separate production decision. The first quality target is **specific photographs, not maximum photograph count**.
