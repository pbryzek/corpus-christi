/*
  # Seed Homepage and About Page Content

  Seeds editable content for the homepage and about page into the existing
  page_content and page_contacts tables. This allows the admin CMS to manage
  these pages' text content.
*/

-- ─── Homepage content sections ────────────────────────────────────────────────

INSERT INTO page_content (page_slug, section_key, title, subtitle, body_text, link_url)
VALUES
  (
    'homepage', 'hero',
    'You Belong Here.',
    'Help Us Build a Home You Love.',
    E'God is love. That''s not just a motto — it''s how we show up, how we gather, and how we try to live.\n\nCome as you are. All are welcome. All belong.',
    'https://player.vimeo.com/video/1179345570'
  ),
  (
    'homepage', 'welcome',
    'All Are Welcome, Especially You.',
    'Married, single, divorced, partnered, parenting — you belong here:',
    E'For nearly 100 years, people have been discovering something they didn''t expect: real community. The kind where someone remembers your name, Fr. Leo''s homily sends you back into the world a little more loving, and Sunday morning becomes something you look forward to, instead of something you endure.\n\nFamilies seeking a vibrant parish and an exceptional K–8 education\nLifelong Catholics and those still discerning\nCatholics returning after time away — including those hurt by the Church\nFirst-time explorers of the Catholic faith\nYoung adults seeking community and faith that''s real\nChildren and teens preparing for the sacraments\nCouples preparing for marriage\n\nWho Is Welcome? Everyone. Really. No asterisks.',
    NULL
  ),
  (
    'homepage', 'difference',
    E'We''re Different. And Real. Come See What We Mean.',
    NULL,
    NULL,
    NULL
  ),
  (
    'homepage', 'deepen',
    'Deepen Your Spiritual Life.',
    E'Wherever you are on your faith journey, there''s something you''ll love.',
    NULL,
    NULL
  ),
  (
    'homepage', 'give',
    'Help Us Build A Home You Love.',
    E'"It is more blessed to give than to receive." — Acts 20:35',
    E'This is the extraordinary home we''re fortifying together:\n\nThe smile from the Sign of Peace that stays with you all day. The music that moves you to tears. The children gathered at the altar before they slip away for their own liturgy. The laughter after Mass over mediocre coffee and good donuts. The hand on your shoulder during a hard moment. The quiet prayer. The holy nudge.\n\nThis is a joyful refuge — a real home where the Holy Spirit shows up, where we count on each other in good times and bad. We are where the simple desire to love like God, act like God, be like God keeps drawing us back.\n\nIt costs real money to keep this special family alive and thriving. Fr. Leo will never ask. So we will.\n\nPlease give. As generously as you''re able.',
    NULL
  )
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- ─── About page content sections ─────────────────────────────────────────────

INSERT INTO page_content (page_slug, section_key, title, subtitle, body_text, link_url)
VALUES
  (
    'about', 'hero',
    'Nearly 100 years of showing up for each other.',
    NULL,
    NULL,
    NULL
  ),
  (
    'about', 'mission',
    E'We''re a Parish Shaped by a Community Who Loves It',
    E'One of the greatest joys of my life is telling others about Corpus Christi. And the fact that I call it a family tells you just about everything you need to know. We''re not a perfect community — we''re a real one. Big hopes, full hearts, and a hunger for something meaningful. And somehow, every Sunday, something happens.\n\nStrangers become neighbors. Neighbors become friends. Friends become family. Some people walk in a little weary and walk out lighter. It always moves me when I see and feel it. Everyone belongs here — all we ask is that you give us a chance to prove it.',
    E'For nearly 100 years, Corpus Christi has been shaped by the people who show up — who serve, who welcome the stranger, and who keep returning because something here is real.\n\nFr. Leo means every word of that. And he''ll be the first to tell you: he doesn''t define this parish. You do.\n\nYour joy.\nYour challenges.\nYour openness.\nYour gifts.\nYour contributions.\n\nThat''s what makes Corpus Christi alive.',
    NULL
  ),
  (
    'about', 'why-corpus',
    'Some Things You Just Have to Experience.',
    E'The music. The welcome. The school. Fr. Leo... and a community that shows up for each other in ways that still surprise us.',
    E'We take faith seriously — and ourselves lightly.\nExpect substance, humor, and homilies worth talking about at brunch.\n\nOur community found us as much as we found them.\nAcross generations, backgrounds, and life stories — the diversity here just happened naturally. And it''s one of our greatest gifts.\n\nWe wrestle with faith openly.\nWe''re a community that sits with complexity, not one that pretends it''s simple.\n\nWe don''t just welcome you — we accept you.\nNot despite who you are, but because of who you are.',
    'https://player.vimeo.com/video/1188520482?badge=0&autopause=0&player_id=0&app_id=58479'
  ),
  (
    'about', 'staff-intro',
    'Meet Our Pastoral Staff',
    E'Educators, musicians, ministers, and theologians — with decades of experience and numerous advanced degrees between them. They love what they do — and it shows.',
    NULL,
    NULL
  )
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- ─── About page staff as page_contacts ────────────────────────────────────────

INSERT INTO page_contacts (page_slug, name, role, email, bio, image_url, sort_order)
VALUES
  ('about', 'Fr. Leo',               'Pastor',                         'office@cc-parish.org',                   'Coming soon. (He''s working on it.)',                                            '/Leo_headshot.png',                          1),
  ('about', 'Ankie Edgar',           'Ministry Manager',               'pastoralcare@cc-parish.org',             '"When others shine, it brings light to our community."',                         '/ankie.png',                                 2),
  ('about', 'Joe Hebert',            'Music Director',                 'ccmusic322@gmail.com',                   '"I''m 60% holy water. 40% sheet music."',                                        '/joe.png',                                   3),
  ('about', 'Adrian Mison Fulay',    'Confirmation Director',          'confirmation@cc-parish.org',             '"When a young person owns their faith, I see God''s grace at work."',             '/adrian.png',                                4),
  ('about', 'Mele Mortonson',        'School Principal',               'principal.mm@corpuschristischool.com',   '"Prayer life in one word: essential."',                                           '/mele.jpg',                                  5),
  ('about', 'Rebeccah Pelle',        'Family Faith Formation Director','familyfaith@cc-parish.org',              '"I ask Mary for the parenting moments that didn''t make the Gospels."',           '/rebecca.png',                               6),
  ('about', 'Anne Kallin Zehren',    'Director, OCIA Ministry',        'annezehren@mac.com',                     '"I love when someone walks in searching and walks out believing."',               '/Screenshot_2026-05-12_114024.png',          7)
ON CONFLICT DO NOTHING;