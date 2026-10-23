/*
  # Seed all page content from static page components

  1. page_photos - Images used on each page
     - music-ministry: 5 photos (choir images, Joe headshot, full-width choir)
     - confirmation: 5 photos (group photo, ceremony cards, Adrian headshot)
     - ocia: 5 photos (session photos, Anne headshot)
     - family-faith-formation: 8 photos (workshops, sacraments, Rebeccah family)
     - family-circle: 2 photos (logo, stock photo)
     - genxish: 2 photos (hero, secondary)

  2. page_content - Text content sections for each page
     - All pages get their hero, description, and key content sections

  3. page_contacts - Team/contact info for each page
     - music-ministry: Joe Hebert
     - confirmation: Adrian Mison Fulay
     - ocia: Anne Kallin Zehren
     - family-faith-formation: Rebeccah Pelle
     - family-circle: email contact
     - living-our-faith: 7 initiative contacts
     - homebound-grief: Helen Merkle, Parish Office
     - altarguild-hospitality: Debra Kalmon, Carol Heard, Art Sui/Karen Keil/Adrian Fulay
     - lectors-altar-eucharistic: Parish office contacts
     - greeters-ushers: Parish office

  4. page_events - Events for pages that have them
     - homebound-grief: 2 annual events
     - family-circle: 1 event (Juicebox Mixer)
     - living-our-faith: 3 events
     - family-faith-formation: 2 events (First Communion, First Reconciliation)
     - confirmation: 2 program descriptions as events
     - ocia: 1 event (weekly sessions)

  5. Important Notes
     - GenXish already has events and contacts in DB, not re-seeded
     - All data uses sort_order for ordering
     - No destructive operations
*/

-- ═══════════════════════════════════════════════════════════════════════════════
-- PAGE_PHOTOS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO page_photos (page_slug, image_url, caption, sort_order, is_featured) VALUES
-- music-ministry
('music-ministry', '/Choir_1.jpg', 'Corpus Christi Choir', 1, true),
('music-ministry', '/Choir_-_vertical_c.jpg', 'Saturday 5pm Mass choir', 2, false),
('music-ministry', '/CU_violinist_c.jpg', 'Sunday 10:30am - live streamed', 3, false),
('music-ministry', '/CU_Choir.jpg', 'Corpus Christi choir at Sunday Mass', 4, false),
('music-ministry', '/joe.png', 'Joe Hebert - Music Director', 5, false),

-- confirmation
('confirmation', '/Group_Confirmation.jpg', 'Confirmation group photo', 1, true),
('confirmation', '/Boy_confirmation_c.jpg', 'Teen receiving confirmation anointing', 2, false),
('confirmation', '/Boy_in_suit_confirmation_c.jpg', 'Teen with sponsor and priest', 3, false),
('confirmation', '/Confirmation1_c.jpg', 'Confirmation candidates walking down the aisle', 4, false),
('confirmation', '/Confirmation_c.jpg', 'Confirmation ceremony at Corpus Christi', 5, false),
('confirmation', '/adrian.png', 'Adrian Mison Fulay', 6, false),

-- ocia
('ocia', '/Resized_20260404_211503.jpeg', 'God Moments and Check-Ins', 1, false),
('ocia', '/Resized_20260404_211408.JPEG', 'Core Teaching and Real Conversation', 2, false),
('ocia', '/image000004.JPG', 'Prayer Experiments', 3, false),
('ocia', '/Screenshot_2026-05-01_at_3.23.33_PM.png', 'Prayer Group', 4, false),
('ocia', '/EliConfirmation.jpg', 'Confirmation rite', 5, false),
('ocia', '/Screenshot_2026-05-12_114024.png', 'Anne Kallin Zehren', 6, false),

-- family-faith-formation
('family-faith-formation', '/_JoyGroupShot.jpg', 'Joyful children at Faith Formation', 1, true),
('family-faith-formation', '/FFF_Art.jpg', 'Art Workshop', 2, false),
('family-faith-formation', '/Music_compressed.jpg', 'Music Workshop', 3, false),
('family-faith-formation', '/cooking.png', 'Cooking Workshop', 4, false),
('family-faith-formation', '/FFF_-_boy_coloring.jpg', 'Whole Family Sessions', 5, false),
('family-faith-formation', '/Girl_Eucharist.Parents.jpg', 'First Communion', 6, false),
('family-faith-formation', '/Screenshot_2026-04-10_095603.png', 'First Reconciliation', 7, false),
('family-faith-formation', '/peele_family.jpg', 'Rebeccah Pelle and family', 8, false),
('family-faith-formation', '/Confirmation.jpg', 'Jr High Faith Formation', 9, false),
('family-faith-formation', '/Confirmation1.jpg', 'Year One Confirmation', 10, false),

-- family-circle
('family-circle', '/files_9546889-2026-05-01T01-11-33-634Z-familycircle.png', 'Family Circle logo', 1, true),
('family-circle', '/ffstock.png', 'Families together', 2, false),

-- genxish
('genxish', '/Screenshot_2026-05-09_at_5.44.23_PM.png', 'GenX-ish Fellowship friends', 1, true),
('genxish', '/Screenshot_2026-05-09_at_5.43.30_PM.png', 'GenX-ish friends enjoying fellowship', 2, false);


-- ═══════════════════════════════════════════════════════════════════════════════
-- PAGE_CONTENT
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO page_content (page_slug, section_key, title, subtitle, body_text, image_url, link_url, link_label) VALUES
-- music-ministry
('music-ministry', 'hero', 'Music at Corpus Christi Doesn''t Just Fill the Space. It Awakens Something in You.', 'Come share our joyful sacred moments with us.', 'Our Sunday liturgy is alive, with a distinct experience of music and prayer joining beautifully.

We''re blessed to have Joseph Hebert — a gifted artist and dedicated music director who has led our music ministry since 2011. He can''t wait to welcome you into the music ministry family!

Our choir doesn''t just inspire us on Sundays — they''ve shared their music around the world. On pilgrimages, they''ve been invited to the Vatican to sing for the Pope at a Papal Audience in Rome, and at cathedrals in Spain, Ireland, Austria, and the Czech Republic, bringing the spirit of Corpus Christi to every community.

Come hear the spirit of Corpus! And if you sing or play — keep reading.', '/Choir_1.jpg', '/mass', 'Join Us This Sunday'),

('music-ministry', 'quote', '"When we trust our voices to say yes to God, miracles happen."', '— Joe Hebert', NULL, NULL, NULL, NULL),

('music-ministry', 'join-choir', 'There''s a Place for Every Voice.', NULL, 'Our choirs are one of the most beautiful expressions of who we are — a community where everyone truly belongs. You don''t need choir experience, just carry a melody and be curious how rewarding singing in a choir can be under Joe''s leadership. Choir here is come as you are — the Holy Spirit will guide the rest.', NULL, 'mailto:ccmusic322@gmail.com', 'Contact Joe to Join'),

('music-ministry', 'choir-sat5pm', 'Saturday 5pm', 'A smaller, intimate choir. Rehearsal at 4pm, right before Mass.', 'Basic singing ability', '/Choir_-_vertical_c.jpg', NULL, NULL),

('music-ministry', 'choir-sun8am', 'Sunday 8am', 'Cantors and seasoned singers. Rehearsal Tuesday evenings 7-8:30pm.', 'More seasoned singers or current ministry members', '/Choir_1.jpg', NULL, NULL),

('music-ministry', 'choir-sun1030am', 'Sunday 10:30am', 'Our largest choir — live streamed. Rehearsal Tuesday evenings 7-8:30pm.', 'Carry a tune. We''ll help with the rest.', '/CU_violinist_c.jpg', NULL, NULL),

('music-ministry', 'choir-cantor', 'Cantor', 'Lead the music at any of our Masses. Schedule flexible.', 'Confident musical leadership — supported through our ministry.', NULL, 'https://player.vimeo.com/video/1191367148?badge=0&autopause=0&player_id=0&app_id=58479', 'Watch Video'),

-- confirmation
('confirmation', 'hero', '77% of Teens Want to Know More About Jesus.', 'Confirmation Gives Them a Safe Place to Explore.', 'That number might surprise you — and it makes our job as parents a little easier, as long as we meet them where they are.

Confirmation is a deeply personal sacrament — and one of the most beautiful ways a young person can say yes to a relationship with Jesus. Through it, your teen receives the gifts and fruits of the Holy Spirit: wisdom, understanding, courage, patience, kindness, goodness, and peace, to name a few.

These are the very values every parent hopes their child carries into adulthood. And they''re exactly what young people tell us they''re craving — they just may not know how to encounter Jesus.

We help your teen become the person God created them to be: rooted in faith, character, and the grace of the Holy Spirit.', '/Group_Confirmation.jpg', '/registration', 'Register'),

('confirmation', 'quote', '"When a young person tries to truly understand their faith in today''s world, I see God''s grace at work."', '— Adrian Mison Fulay, Confirmation Director', NULL, NULL, NULL, NULL),

('confirmation', 'what-is', 'What Is Confirmation?', NULL, 'Confirmation is one of the three Sacraments of Initiation — alongside Baptism and Eucharist. If Baptism offers life, and the Eucharist sustains it, Confirmation strengthens it.

For teens baptized as infants, Confirmation is their moment to claim the faith their parents chose for them. It is a conscious, personal yes — sealed with the gift of the Holy Spirit. Some call it a tattoo on the heart. It''s permanent. It changes you.

Through the laying on of hands and anointing with sacred chrism oil, what began interiorly at Baptism becomes outward and active. Your teen is not just receiving a sacrament. They are being commissioned — to carry faith, courage, kindness, and peace into the world.', NULL, NULL, NULL),

('confirmation', 'commitment', 'The Commitment', NULL, 'Corpus Christi and St. Theresa Parish have joined together for Confirmation — bringing two communities of teens into one. The program unfolds over two years, each with its own focus and its own director.', NULL, NULL, NULL),

-- ocia
('ocia', 'hero', 'Something brought you here.', 'Order of Christian Initiation of Adults', NULL, NULL, NULL, NULL),

('ocia', 'intro', NULL, NULL, 'Maybe you''re interested in becoming Catholic, or completing your sacraments. Or maybe it''s a yearning for more meaning... Whatever it is — that''s God.

OCIA is a journey of no-pressure discernment and transformation. You walk in carrying your questions, your history, your longing. Through prayer, instruction, and a community that genuinely cares, something shifts.

You learn to find God in ordinary life. You discover how to pray in a way that feels like a real conversation. And you find that God has been calling you by name all along — loving you completely, no matter what.

The end of this process is a new beginning. You walk out different — with the desire to love like Jesus.', NULL, '/contact', 'Contact Anne'),

('ocia', 'quote', '"The Spiritual Transformation: When someone realizes they don''t have to check their doubts at the door and they start having ''God Moments.'' That''s when the real learning begins."', '— Anne Kallin Zehren, OCIA Director', NULL, NULL, NULL, NULL),

('ocia', 'session-format', 'This Isn''t a Lecture. It''s a Conversation.', NULL, 'Each session is interactive, personal, and grounded in real questions. Here''s what a typical gathering looks like.', NULL, NULL, NULL),

('ocia', 'specifics', 'The Specifics', NULL, 'Wednesday evenings, 5:45 - 7:30pm
October 15, 2025 - April 14, 2026 — intentionally condensed into six months so it fits into real life.
Gibson Center, 322 St. James Drive, Piedmont
A light dinner is served. Because community happens around a table.', '/EliConfirmation.jpg', NULL, NULL),

-- family-faith-formation
('family-faith-formation', 'hero', 'God Loves Your Kids. And So Do We.', 'Our Faith Formation program brings your whole family closer to God.', 'Welcome to Faith Formation That Inspires Your Child and Brings Your Family Together.', '/_JoyGroupShot.jpg', 'https://docs.google.com/forms/d/e/1FAIpQLSfYJOljbOVuy2-qq9DrMJv1M7xaJgXM8f1IWUkTNsGTpa3utQ/viewform?usp=send_form', 'Enroll Now'),

('family-faith-formation', 'quote', '"I love seeing kids'' faces as they return to their pew — relieved and joyful — after their first experience of a sacrament."', '— Rebeccah Pelle, Family Faith Formation Director', NULL, NULL, NULL, NULL),

('family-faith-formation', 'formation', 'Real Formation. Real Joy. Real Community.', NULL, 'Every month, September through May, families and kids gather for something that feels less like school and more like community. TK through 8th grade. Three sessions a month, 9-10:15am. Some mornings bring the whole family together. Others are just for kids — rotating through creative, hands-on workshops that make faith tangible, memorable, and genuinely fun.', NULL, NULL, NULL),

('family-faith-formation', 'sacraments', 'We Belong to God and Each Other.', NULL, 'That''s what the sacraments remind us. That''s what we celebrate here. Walking with you through the sacred moments.', NULL, NULL, NULL),

('family-faith-formation', 'jr-high', 'Jr High & Year One Confirmation.', NULL, 'Rebeccah Pelle also guides students in grades 6-9 through Junior High faith formation and Year One of the Confirmation journey. Monthly gatherings on Sunday mornings or the 3rd Saturday of the month. To qualify for Year Two of Confirmation, 9th graders must attend at least 8 sessions over the course of the year.', NULL, NULL, NULL),

-- family-circle
('family-circle', 'hero', 'Family Circle', 'Connecting young families within our faith community.', NULL, '/files_9546889-2026-05-01T01-11-33-634Z-familycircle.png', NULL, NULL),

('family-circle', 'about', NULL, NULL, 'We are Family Circle, a new group at Corpus Christi, looking to connect young families within our faith community.

We''ll start with quarterly Juicebox Mixers after the 10:30 mass to create space for families to get to know each other. Depending on what our community wants, we''ll host other gatherings such as playdates, social gatherings, and faith-based events. Stay tuned for details on these upcoming events!

We''re so excited to build this community with you!', '/ffstock.png', NULL, NULL),

('family-circle', 'signup', 'Join Our Contact List', NULL, 'Want to stay in the loop on upcoming events? Fill out our short form and we''ll keep you posted.', NULL, 'https://forms.gle/iWa9B5VBR1TWG4to9', 'Sign Up'),

-- living-our-faith
('living-our-faith', 'hero', 'We Are Called to Act.', '"If faith does not have works, it is dead." — James 2:17', 'Catholic Social Teaching calls us to a preferential option for the poor, the marginalized, and the vulnerable — something we believe is a way of life. In partnership with St. Theresa''s Social Justice Committee, Living Our Faith is how we answer that call — showing up, speaking up, and serving those who need it most. All parishioners are welcome.', NULL, NULL, NULL),

('living-our-faith', 'how-we-live', 'How We Live It.', NULL, 'We gather — for faith-sharing, mutual support, and to keep our ministries thriving.
We pray — because every act of justice begins with God.
We study — because understanding our world makes us better advocates for change.
We serve — because faith without action isn''t enough.', NULL, NULL, NULL),

('living-our-faith', 'join', 'Join Us.', NULL, 'Every 2nd Thursday, 6:30-8:00pm
Gibson Center, Corpus Christi Parish
Spring 2026: April 9, May 14, June 11', NULL, NULL, NULL),

-- genxish
('genxish', 'hero', 'GenX-ish Fellowship', 'Friendship, faith, and the questions of midlife.', NULL, '/Screenshot_2026-05-09_at_5.44.23_PM.png', 'https://forms.gle/2RDUSXznfu5UP9P49', 'Get Connected!'),

('genxish', 'who-we-are', 'A community for the season of life nobody warned you about.', NULL, 'We are GenX (and GenX-adjacent) parishioners seeking meaningful connection in a season that is often full — and changing.', '/Screenshot_2026-05-09_at_5.43.30_PM.png', NULL, NULL),

('genxish', 'what-we-do', 'Real gatherings. Real conversations.', NULL, 'Social Events: Cocktail socials, backyard BBQs, and pizza patios — the stuff that turns strangers into friends.
Service: Opportunities to make a difference alongside people who share your values.
Faith and Life: Formational discussions about the big questions — faith, meaning, family, and what''s next.', NULL, NULL, NULL),

-- homebound-grief
('homebound-grief', 'hero', 'Ministry to the Homebound & Grief Support', NULL, 'We are here for you. When life makes it hard to be with us, we come to you. And when loss makes everything heavy, we walk alongside you.', NULL, NULL, NULL),

('homebound-grief', 'homebound', 'Ministry to the Homebound', NULL, 'Our Eucharistic Ministers to the Homebound visit parishioners who are sick, homebound, or in assisted living — bringing the Eucharist and the presence of this community directly to them. No one should feel alone or forgotten.

If you or a loved one would like a visit, please reach out. We would be honored to come.', NULL, NULL, NULL),

('homebound-grief', 'grief', 'Grief Support', NULL, 'Our Grief Support Ministers offer a compassionate presence during loss and companionship on the long road back to renewal. We hold an annual Evening of Remembrance and a Coping with the Holidays Workshop — and we''re available year-round for those who need a caring ear.

"Blessed are those who mourn, for they will be comforted." — Matthew 5:4', NULL, NULL, NULL),

-- greeters-ushers
('greeters-ushers', 'hero', 'Greeters & Ushers', NULL, 'You are the first face someone sees when they walk through our doors. That moment — for a first-timer, for someone returning after years away — matters more than you know.', NULL, NULL, NULL),

('greeters-ushers', 'greeters', 'Greeters', NULL, 'Greeters welcome parishioners and visitors before Mass with a warm smile and a genuine hello. It''s a small gesture with an outsized impact — especially for anyone who walked in feeling uncertain about whether they belong.

"The moment someone feels seen — really seen — is the moment they start to feel at home."', NULL, NULL, NULL),

('greeters-ushers', 'ushers', 'Ushers', NULL, 'Ushers help guide our community through the flow of Mass — from seating to the offertory collection to anything else that comes up. It''s a quiet, steady form of service that keeps everything running smoothly for everyone.', NULL, NULL, NULL),

-- altarguild-hospitality
('altarguild-hospitality', 'hero', 'Altar Guild, Hospitality & Environmental', NULL, 'We belong to God and each other. These three teams make that truth visible — in the beauty of our sanctuary, the welcome at our table, and the spirit of every gathering.', NULL, NULL, NULL),

('altarguild-hospitality', 'altar-guild', 'Altar Guild', NULL, 'The Altar Guild cares for the candlesticks and sacred vessels that grace our church. It''s detail-oriented, meditative work — about 20-30 minutes, typically every other month. A lovely way to serve quietly and faithfully.', NULL, NULL, NULL),

('altarguild-hospitality', 'hospitality', 'Hospitality Committee', NULL, 'The Hospitality Committee creates fellowship after Mass and for special occasions — the coffee, the conversation, the sense that this community is worth lingering in. Community happens around a table, and this team sets it.', NULL, NULL, NULL),

('altarguild-hospitality', 'environmental', 'Environmental Committee', NULL, 'This team plans and prepares the liturgical environment of our church — seasonal decor, sacred aesthetics, the visual language of our worship. If you have an eye for beauty and a love of liturgy, this is your ministry.', NULL, NULL, NULL),

-- lectors-altar-eucharistic
('lectors-altar-eucharistic', 'hero', 'Lectors, Altar Servers & Eucharistic Ministers', NULL, 'The hands, voice, and presence that bring our liturgy to life. Training is always available — no experience required.', NULL, NULL, NULL),

('lectors-altar-eucharistic', 'lectors', 'Lectors', NULL, 'Lectors proclaim the Word of God at Mass. It''s one of the most visible — and most meaningful — roles in our liturgy. If you feel called to serve, we''d love to help you find your voice.

Lord God, be on my mind, on my lips, and in my heart as I humbly proclaim your Word.', NULL, NULL, NULL),

('lectors-altar-eucharistic', 'altar-servers', 'Altar Servers', NULL, 'Open to all students in 5th grade or older, and to adults. Altar servers assist at Mass and special liturgies — a beautiful way to serve the community from the heart of the sanctuary.', NULL, NULL, NULL),

('lectors-altar-eucharistic', 'eucharistic', 'Eucharistic Ministers', NULL, 'Eucharistic Ministers assist the presider in serving the consecrated bread and wine to our assembly. It is a profound privilege — and a tangible expression of our care for one another.', NULL, NULL, NULL),

-- formed
('formed', 'hero', 'Everything You Want to Know About Your Faith. On Your Own Time. For Free.', NULL, NULL, NULL, NULL, NULL),

('formed', 'about', NULL, NULL, 'FORMED is the Catholic faith platform — films, documentaries, books, podcasts, scripture studies, and daily reflections for every age and stage of faith.

Curious about the Eucharist? Want to go deeper on the Gospels? Looking for something to watch with your family on a Friday night? It''s all here.

As a Corpus Christi parishioner, it''s yours at no cost.', NULL, 'https://formed.org', 'Start Exploring at formed.org'),

('formed', 'signup', 'Signing Up is Easy.', NULL, '1. Go to formed.org/signup
2. Enter our parish name: Corpus Christi Church, Piedmont, CA 94611
3. Enter your name and email — and start exploring.

Can''t get in? Your email may not be on file. Contact us at office@cc-parish.org and we''ll add you.', NULL, 'https://formed.org', 'Go to FORMED');


-- ═══════════════════════════════════════════════════════════════════════════════
-- PAGE_CONTACTS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO page_contacts (page_slug, name, role, email, phone, bio, image_url, sort_order) VALUES
-- music-ministry
('music-ministry', 'Joe Hebert', 'Music Director', 'ccmusic322@gmail.com', NULL, 'Classically trained musician. Symphony, orchestral conducting, choral directing, studio recordings, and performance tours throughout the US and beyond. BA Music Performance, Cal State Hayward. Graduate Studies in Pastoral Ministry, Holy Names University. Post-Baccalaureate Studies in Cello Performance, Stanford University. Director of Music Ministry in the Diocese of Oakland since 2011.', '/joe.png', 1),

-- confirmation
('confirmation', 'Adrian Mison Fulay', 'Confirmation & Youth Ministry Director', 'confirmation@cc-parish.org', NULL, 'BA in Political Science, Loyola Marymount University. Masters in Theological Studies, Jesuit School of Theology, Berkeley — focusing on Liturgy, Youth, and Inculturation. Catholic school educator for 32 years in Religion and Youth Ministry.', '/adrian.png', 1),

-- ocia
('ocia', 'Anne Kallin Zehren', 'Director, OCIA Ministry', 'annezehren@mac.com', NULL, 'Graduate degree in Theological Studies, Jesuit School of Theology; BA, Marquette University. Trained Spiritual Director. Supposedly retired from 30 years of launching companies in Silicon Valley and NYC — including Publisher of Teen People and Glamour magazines. God had other plans.', '/Screenshot_2026-05-12_114024.png', 1),

-- family-faith-formation
('family-faith-formation', 'Rebeccah Pelle', 'Family Faith Formation Director', 'familyfaith@cc-parish.org', NULL, 'Masters of Divinity, Jesuit School of Theology, Berkeley (2003). Previously at All Saints in Hayward and St. Augustine in Oakland. In lay ministry leadership since age 16.', '/peele_family.jpg', 1),

-- family-circle
('family-circle', 'Family Circle', 'Contact', 'ccfamilycircle@gmail.com', NULL, NULL, NULL, 1),

-- living-our-faith
('living-our-faith', 'Jim Beck', 'Welcome the Stranger', 'jimbeck282@gmail.com', NULL, 'Accompanying immigrant families as they navigate public services; employment; education; health care; transportation, housing and language in their efforts to successfully integrate into their new communities.', NULL, 1),
('living-our-faith', 'Mary Lim-Lampe', 'Genesis', 'marylimlampe@gmail.com', NULL, 'Advocacy campaigns for immigrant protection and public transit/disability justice through community organizing.', NULL, 2),
('living-our-faith', 'Bob Hernandez', 'Oakland Catholic Worker', 'bob.hernandez@mac.com', NULL, 'Standing in solidarity with vulnerable neighbors — including street-corner food distribution and ICE response protocols.', NULL, 3),
('living-our-faith', 'Trish Ratto', 'Food Bank', 'trishratto16@gmail.com', NULL, 'Over $17,000 and 3,000 pounds of food donated to the Alameda County Community Food Bank in the past 2.5 years.', NULL, 4),
('living-our-faith', 'Paul Loh', 'Welcome Committee', 'paul@lohrealty.com', NULL, 'Every new face at Corpus Christi deserves to feel at home. Our team makes sure every new parishioner feels valued right from the start.', NULL, 5),
('living-our-faith', 'Marie Reich', 'Book Group', 'marie.reich@gmail.com', NULL, 'Deep reading and discussion of faith in action — currently exploring Pope Leo''s Dilexi Te, Exhortation on Love for the Poor.', NULL, 6),
('living-our-faith', 'Nancy Midlin', 'Advent Giving Tree / Coordinator', 'midlin.nancy@gmail.com', NULL, 'A parish-wide initiative coordinating the collection and distribution of gifts and gift cards to families and seniors in our neighborhood communities.', NULL, 7),

-- homebound-grief
('homebound-grief', 'Helen Merkle', 'Ministry to the Homebound', 'h17merkle@yahoo.com', '510.459.0690', NULL, NULL, 1),
('homebound-grief', 'Parish Office', 'Grief Support', 'office@cc-parish.org', '510.530.4343', NULL, NULL, 2),

-- altarguild-hospitality
('altarguild-hospitality', 'Debra Kalmon', 'Altar Guild', NULL, '510.529.1014', NULL, NULL, 1),
('altarguild-hospitality', 'Carol Heard', 'Hospitality Committee', 'ministries@cc-parish.org', NULL, NULL, NULL, 2),
('altarguild-hospitality', 'Art Sui, Karen Keil & Adrian Fulay', 'Environmental Committee', 'ministries@cc-parish.org', NULL, NULL, NULL, 3),

-- lectors-altar-eucharistic
('lectors-altar-eucharistic', 'Parish Office', 'Lectors, Altar Servers & Eucharistic Ministers', 'ministries@cc-parish.org', '510.530.4343', NULL, NULL, 1),

-- greeters-ushers
('greeters-ushers', 'Parish Office', 'Greeters & Ushers Coordinator', 'office@cc-parish.org', '510.530.4343', NULL, NULL, 1);


-- ═══════════════════════════════════════════════════════════════════════════════
-- PAGE_EVENTS (for pages that don't already have events in DB)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO page_events (page_slug, emoji, title, description, event_date, location, rsvp_open, rsvp_url, sort_order) VALUES
-- homebound-grief
('homebound-grief', NULL, 'Evening of Remembrance', 'A prayerful gathering to honor those we have lost', 'Annual', 'Corpus Christi Parish', false, NULL, 1),
('homebound-grief', NULL, 'Coping with the Holidays Workshop', 'Practical support for a tender time of year', 'Annual (November/December)', 'Corpus Christi Parish', false, NULL, 2),

-- family-circle
('family-circle', NULL, 'Juicebox Mixers', 'Quarterly gatherings after the 10:30 mass to create space for families to get to know each other', 'Quarterly after 10:30 Mass', 'Corpus Christi Parish', false, NULL, 1),

-- living-our-faith
('living-our-faith', NULL, 'Faithful Witness — Protecting Immigrants', 'Training/Prep: April 14', 'April 16, 2026 · 8-10am', '630 Sansome St, SF Immigration Court', false, 'mailto:gamaliel.genesisca@gmail.com', 1),
('living-our-faith', NULL, 'Issue Campaign Planning', 'Genesis · All are welcome · Bring a brunch item', 'April 11, 2026 · 9:30-11am', 'First Congregational Church of Oakland, 2501 Harrison St', false, NULL, 2),
('living-our-faith', NULL, 'Immigrant Vigil', 'Community vigil in solidarity with immigrant families', 'Recent', NULL, false, NULL, 3),

-- confirmation
('confirmation', NULL, 'Jr High & Year One (Grades 6-9)', 'Monthly gatherings on the First Saturday and/or Third Saturday, 6-7pm. A year of exploring faith alongside peers.', 'Monthly - First/Third Saturday', 'Corpus Christi Parish', false, NULL, 1),
('confirmation', NULL, 'Year Two (Grades 10-12)', 'Monthly sessions, a retreat, and service in the community — culminating in the Sacrament of Confirmation celebrated by the Bishop in the spring.', 'Monthly', 'Corpus Christi Parish', false, NULL, 2),

-- ocia
('ocia', NULL, 'OCIA Weekly Sessions', 'Wednesday evenings — interactive sessions, real conversation, prayer experiments, and dinner together.', 'Oct 15, 2025 - Apr 14, 2026 · Wed 5:45-7:30pm', 'Gibson Center, 322 St. James Drive, Piedmont', false, NULL, 1),

-- family-faith-formation
('family-faith-formation', NULL, 'Monthly Faith Formation Sessions', 'TK through 8th grade. Three sessions a month, 9-10:15am. Rotating creative workshops.', 'Monthly, September through May', 'Corpus Christi Parish', false, NULL, 1),
('family-faith-formation', NULL, 'First Communion Preparation', 'Six family sessions beginning in January for children 7 and older, woven into the 10:30am Mass.', 'January - Spring', 'Corpus Christi Parish', false, NULL, 2),
('family-faith-formation', NULL, 'First Reconciliation Preparation', 'Four family sessions beginning in October for children in 4th grade and older.', 'October - December', 'Corpus Christi Parish', false, NULL, 3);
