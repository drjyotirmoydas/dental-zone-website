# দি ডেন্টাল জোন ওয়েবসাইট: ব্যবহার নির্দেশিকা

## ফাইলসমূহ
- `index.html` পুরো ওয়েবসাইট (একটি পেজ)
- `styles.css` ডিজাইন, `script.js` হোয়াটসঅ্যাপ ফর্ম ও গ্যালারি
- `data/gallery.json` গ্যালারির ছবি/ভিডিওর তালিকা
- `assets/media/gallery/` গ্যালারির ছবি ও ভিডিও ফাইল
- `.pages.yml` অ্যাডমিন প্যানেলের সেটিং

## হোয়াটসঅ্যাপ নম্বর বদলাতে
`script.js` ফাইলের শুরুতে `CHAMBERS` অংশে `wa:` নম্বর বদলান (৮৮০ দিয়ে শুরু, প্রথম ০ বাদ)।
এখন: তিনটি চেম্বারের সব বুকিং 8801728885550 নম্বরে যায় (মালিকের নির্দেশ, ১৫ নভেম্বর ২০২৬)।

## ছবি ও ভিডিও যোগ করতে (অ্যাডমিন প্যানেল)
ওয়েবসাইট অনলাইনে তোলার পর (GitHub + Cloudflare Pages/Netlify):
1. https://app.pagescms.org এ GitHub দিয়ে লগইন করুন (মোবাইল থেকেও হয়)।
2. ওয়েবসাইটের রিপোজিটরি খুলুন, বাম পাশে "গ্যালারি" চাপুন।
3. "ছবি / ভিডিও" তালিকায় Add চাপুন: শিরোনাম, বিভাগ, ধরন (আগে-পরে স্লাইডার/ছবি/ভিডিও/ইউটিউব/ফেসবুক), ছবি আপলোড, ছোট বিবরণ।
   - আগে-পরে স্লাইডারের জন্য "আগের ছবি" ও "পরের ছবি" দুটোই দিন; দুটো ছবি একই মাপে ও একই কোণ থেকে তোলা হলে স্লাইডার সবচেয়ে সুন্দর দেখায়।
4. Save চাপুন। ১-২ মিনিটের মধ্যে ওয়েবসাইটে দেখা যাবে।
- কোনো ছবি সরাতে "ওয়েবসাইটে দেখাবে" বন্ধ করুন বা আইটেমটি মুছে দিন।
- বড় ভিডিও (২৫ MB-এর বেশি) ইউটিউব বা ফেসবুকে আপলোড করে লিংক দিন।

## রোগীর ছবি প্রকাশের নিয়ম
- রোগীর লিখিত/মৌখিক অনুমতি নিন। রোগীর নাম, ফোন নম্বর বা চেনা যায় এমন তথ্য লিখবেন না।
- মুখের ছবি হলে চোখের নিচ থেকে ক্রপ করুন, যদি না রোগী পূর্ণ মুখের ছবিতে সম্মতি দেন।

---
English summary: static one-page site. Gallery content lives in data/gallery.json and is edited through Pages CMS (free, GitHub login) using .pages.yml. WhatsApp numbers are in script.js (CHAMBERS). Opening index.html directly from a folder uses data/gallery-fallback.js; regenerate it from gallery.json if you edit the JSON by hand.

## English version (/en/)
The site has an English page at drjyotirmoy.com/en/ with a বাংলা / English switch (flags) in the header; Bangla stays the default.
- Page text lives in `en/index.html` (Bangla text in `index.html`). Change both when you edit wording, phone numbers or hours.
- Each gallery item has `English title` and `English caption` fields in the admin panel. If they are empty, the English page shows the Bangla title.
