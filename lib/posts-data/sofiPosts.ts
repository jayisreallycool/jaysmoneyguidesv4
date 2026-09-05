import { BlogPost } from '../types';

/**
 * SoFi Bank category — affiliate content.
 *
 * COMPLIANCE (per SoFi Referral Program Official Rules + FTC):
 *  - Each article carries a clear, conspicuous affiliate/material-connection
 *    disclosure stating the specific benefit the author receives.
 *  - No specific interest rates, APYs, or fees are stated — SoFi prohibits this
 *    and rates change; readers are directed to SoFi's official pages instead.
 *  - No "guaranteed approval" / "best rates" / outcome guarantees.
 *  - "See official rules" is linked wherever the referral bonus is mentioned.
 *  - External links render with rel="nofollow sponsored" automatically via the
 *    post renderer.
 *
 * Affiliate/referral links (the author's real invite links):
 *  personal loans   : https://www.sofi.com/invite/personal-loans?gcp=f694b62f-0bd0-46e4-8489-13fa4dbe2d57&isAliasGcp=false&siid=2c10d514-bead-4026-a011-aa5f1593513b
 *  student refi     : https://www.sofi.com/invite/student-loans?gcp=10cf9c52-9d29-43fe-9672-491f50ebbe13&isAliasGcp=false&siid=4986fd59-30ed-45d7-83d8-cb2f324faa87
 *  medical refi     : https://www.sofi.com/invite/medical-student-loans?gcp=15f11045-eed3-480b-816d-69a83f2cd79b&isAliasGcp=false&siid=c8eca57f-268c-44cd-85ef-f962aa1da6e1
 *  private student  : https://www.sofi.com/invite/private-student-loans?gcp=ddf331f3-ccfb-49e6-92b9-58f7877a7342&isAliasGcp=false&siid=10afddd8-1ecd-4672-9b52-5495e8eec6b7
 *  money (referral) : https://www.sofi.com/invite/money?gcp=cbb90c63-c9ec-487c-a425-bb95feac5201&isAliasGcp=false&siid=c0a81ea2-40c9-4fcc-9a3a-9a54766f7012
 */

const DISCLOSURE = `> **Advertising disclosure:** This article contains SoFi referral links. If you open an eligible SoFi product through them, I may receive a referral bonus at no extra cost to you — and in some cases you may receive a welcome bonus too. I only share products I think are worth a look, but I'm not a financial advisor and this isn't financial advice. Rates, fees, and terms change and are set by SoFi, not me — always confirm the current details on SoFi's official pages before applying.`;

const AUTHOR = {
  name: 'Jay Lopez',
  role: 'Founder & Lead Strategist',
  avatar: '/images/jaysmoneyguides-logo.webp',
};

const PERSONAL = 'https://www.sofi.com/invite/personal-loans?gcp=f694b62f-0bd0-46e4-8489-13fa4dbe2d57&isAliasGcp=false&siid=2c10d514-bead-4026-a011-aa5f1593513b';
const STUDENT_REFI = 'https://www.sofi.com/invite/student-loans?gcp=10cf9c52-9d29-43fe-9672-491f50ebbe13&isAliasGcp=false&siid=4986fd59-30ed-45d7-83d8-cb2f324faa87';
const MEDICAL = 'https://www.sofi.com/invite/medical-student-loans?gcp=15f11045-eed3-480b-816d-69a83f2cd79b&isAliasGcp=false&siid=c8eca57f-268c-44cd-85ef-f962aa1da6e1';
const PRIVATE = 'https://www.sofi.com/invite/private-student-loans?gcp=ddf331f3-ccfb-49e6-92b9-58f7877a7342&isAliasGcp=false&siid=10afddd8-1ecd-4672-9b52-5495e8eec6b7';
const MONEY = 'https://www.sofi.com/invite/money?gcp=cbb90c63-c9ec-487c-a425-bb95feac5201&isAliasGcp=false&siid=c0a81ea2-40c9-4fcc-9a3a-9a54766f7012';
const RULES = 'https://www.sofi.com/referral-program/?hidenav=once#official-rules';

export const SOFI_POSTS: BlogPost[] = [
  // ============================ 1. PERSONAL LOANS ============================
  {
    id: 'post-sofi-1',
    title: 'SoFi Personal Loans: How to Decide if One Fits Your Money Goals',
    slug: 'sofi-personal-loans-guide',
    excerpt: 'A plain-English look at how SoFi personal loans work, common ways people use them (like consolidating higher-interest debt), and the questions to ask before you apply.',
    category: 'SoFi Bank',
    tags: ['SoFi', 'Personal Loans', 'Debt Consolidation', 'Personal Finance'],
    coverImage: '/images/sofi/personal-loans.svg',
    author: AUTHOR,
    publishedAt: '2026-08-30',
    readTimeMinutes: 8,
    difficulty: 'Beginner',
    featured: true,
    views: 0,
    likes: 0,
    rating: 0,
    ratingCount: 0,
    seoKeywords: ['sofi personal loans', 'sofi loan review', 'debt consolidation loan', 'personal loan guide'],
    metaDescription: 'How SoFi personal loans work, common uses like debt consolidation, and the questions to ask before applying. Affiliate disclosure included.',
    keyTakeaways: [
      'A personal loan is a fixed-amount, fixed-term installment loan — useful when you want predictable payments.',
      'One of the most common smart uses is consolidating higher-interest debt into a single payment.',
      'Rates, fees, and approval depend on your profile and are set by the lender — always check SoFi\'s official page for current terms.',
      'Borrow only what you can comfortably repay, and compare the total cost, not just the monthly payment.',
    ],
    content: `
# SoFi Personal Loans: How to Decide if One Fits Your Money Goals

${DISCLOSURE}

[![Check your rate on a SoFi personal loan](/images/sofi/personal-loans.svg)](${PERSONAL})

A personal loan is one of the simplest tools in personal finance: you borrow a fixed amount, then repay it in equal monthly installments over a set term. No revolving balance, no surprise, no shifting minimum payment. For the right situation, that predictability is exactly the point.

SoFi is one of the better-known lenders in this space, and if you're weighing whether one of their personal loans fits your goals, this guide walks through how they work and what to think about — without quoting numbers that change constantly. For current rates, fees, and terms, always go straight to the source: **[see SoFi's personal loan details here](${PERSONAL})**.

## What a personal loan is actually good for

The most common — and often smartest — use is **debt consolidation**. If you're carrying balances on multiple higher-interest credit cards, rolling them into a single fixed-rate installment loan can simplify your life: one payment, one due date, one payoff date you can actually see coming. Whether it saves you money depends entirely on the rate you qualify for versus what you're paying now, so run the math on the *total* cost.

Other common uses: a major planned expense (a home repair, a medical bill), or refinancing an existing higher-cost loan. What a personal loan is *not* good for is funding a lifestyle you can't afford — the fixed payment is only a gift if you can comfortably make it.

## Questions to ask before you apply

- **What's the total cost, not just the monthly payment?** A lower monthly payment stretched over a longer term can cost more overall.
- **Are there fees?** Origination fees and prepayment terms vary by lender and change over time — confirm the current details on [SoFi's official page](${PERSONAL}).
- **Can I comfortably afford the payment** even if my income dips for a month or two?
- **Does checking my rate affect my credit?** Many lenders let you check an estimated rate with a soft pull; verify how SoFi handles this before you apply.

## A quick, honest reality check

I can't promise you approval or a specific rate — nobody legitimately can, and SoFi's rules (rightly) prohibit that kind of claim. Your rate depends on your credit profile, income, and other factors the lender evaluates. What I *can* say is that a fixed-rate personal loan is a genuinely useful tool when used deliberately, and SoFi is a reputable place to see what you'd qualify for.

---

### Ready to see your options?

If a personal loan fits where you're headed, the sensible next step is simply to check your rate — it costs nothing to look.

**[→ Check your rate on a SoFi personal loan](${PERSONAL})**

*Bonus: SoFi also runs a referral program on its money products — you and a friend can each earn a bonus when they open and fund an eligible account. [See official rules](${RULES}) for the current terms and eligibility.*
`,
  },

  // ========================= 2. STUDENT LOAN REFINANCE ======================
  {
    id: 'post-sofi-2',
    title: 'Student Loan Refinancing with SoFi: Is Now the Right Time?',
    slug: 'sofi-student-loan-refinancing-guide',
    excerpt: 'Refinancing can simplify repayment and potentially lower your cost — but it also has real trade-offs, especially with federal loans. Here\'s how to think it through.',
    category: 'SoFi Bank',
    tags: ['SoFi', 'Student Loans', 'Refinancing', 'Personal Finance'],
    coverImage: '/images/sofi/student-refi.svg',
    author: AUTHOR,
    publishedAt: '2026-08-30',
    readTimeMinutes: 9,
    difficulty: 'Beginner',
    featured: true,
    views: 0,
    likes: 0,
    rating: 0,
    ratingCount: 0,
    seoKeywords: ['sofi student loan refinance', 'student loan refinancing', 'refinance student loans', 'lower student loan payment'],
    metaDescription: 'How SoFi student loan refinancing works, the key trade-offs of refinancing federal loans, and how to decide if now is the right time. Affiliate disclosure included.',
    keyTakeaways: [
      'Refinancing replaces one or more existing loans with a new private loan — ideally at better terms.',
      'Refinancing federal loans into a private loan means giving up federal protections like income-driven repayment and forgiveness programs.',
      'It tends to make the most sense for borrowers with stable income and strong credit who don\'t need federal benefits.',
      'Check current eligibility and terms on SoFi\'s official page before deciding.',
    ],
    content: `
# Student Loan Refinancing with SoFi: Is Now the Right Time?

${DISCLOSURE}

[![Explore SoFi student loan refinancing](/images/sofi/student-refi.svg)](${STUDENT_REFI})

Refinancing student loans sounds like a purely financial decision, but it's really a *trade-off* decision. Done at the right time, it can simplify repayment and potentially lower what you pay. Done at the wrong time — especially with federal loans — it can cost you protections you'd really want to keep.

Here's how to think it through clearly. For current eligibility and terms, go straight to **[SoFi's student loan refinancing page](${STUDENT_REFI})**.

## What refinancing actually does

When you refinance, a lender pays off your existing loan(s) and issues you a **new private loan** in their place — ideally with a better rate, a term that fits your budget, or both. Instead of juggling several loans, you get one payment and one payoff date.

That's the upside. The trade-off is what matters most.

## The federal-loan trade-off you can't ignore

This is the single most important thing in this article: **refinancing federal student loans into a private loan means giving up federal benefits.** That can include income-driven repayment plans, certain deferment and forbearance options, and forgiveness programs like Public Service Loan Forgiveness.

If there's any chance you'll rely on those protections — say your income is variable, or you work toward forgiveness — refinancing federal loans may not be right for you, no matter how attractive the new terms look. For **private** student loans, that trade-off doesn't apply in the same way, which is why refinancing them is often a more straightforward call.

## Who refinancing tends to fit

Refinancing generally makes the most sense for borrowers who:

- Have **stable income** and a **solid credit profile**
- Don't expect to need federal repayment protections
- Want to simplify multiple loans into one, or adjust their term

If that sounds like you, it's at least worth seeing what you'd qualify for.

[![See your student loan refinancing options with SoFi](/images/sofi/student-refi.svg)](${STUDENT_REFI})

## Before you decide

- Confirm which of your loans are **federal vs. private** — the trade-off only bites on federal.
- Compare the **total cost** over the life of the loan, not just the monthly payment.
- Check current rates and terms on [SoFi's official page](${STUDENT_REFI}) — they change, and I'm not permitted (nor able) to quote them here.

---

### Next step

If the trade-offs work in your favor, checking your rate is a no-cost way to see real numbers for your situation.

**[→ Explore SoFi student loan refinancing](${STUDENT_REFI})**

*SoFi also offers referral bonuses on its money products for you and a friend when an eligible account is opened and funded. [See official rules](${RULES}).*
`,
  },

  // ===================== 3. MEDICAL/DENTAL REFINANCING ======================
  {
    id: 'post-sofi-3',
    title: 'Student Loan Refinancing for Doctors and Dentists: What Makes It Different',
    slug: 'sofi-medical-dental-student-loan-refinancing',
    excerpt: 'Medical and dental grads carry unusually large loan balances and a unique career arc. Here\'s why refinancing works differently for them — and what to weigh.',
    category: 'SoFi Bank',
    tags: ['SoFi', 'Student Loans', 'Medical School', 'Refinancing'],
    coverImage: '/images/sofi/medical-refi.svg',
    author: AUTHOR,
    publishedAt: '2026-08-30',
    readTimeMinutes: 9,
    difficulty: 'Intermediate',
    featured: false,
    views: 0,
    likes: 0,
    rating: 0,
    ratingCount: 0,
    seoKeywords: ['medical student loan refinancing', 'refinancing for doctors', 'dentist student loans', 'sofi medical refinance'],
    metaDescription: 'Why student loan refinancing works differently for doctors and dentists, including residency considerations and large balances. Affiliate disclosure included.',
    keyTakeaways: [
      'Medical and dental grads often carry very large balances, so even small rate differences can matter a lot over time.',
      'Residency and fellowship timing is a key factor — some refinancing programs account for training periods.',
      'The federal-benefit trade-off is especially important for those pursuing loan forgiveness through qualifying employment.',
      'Check SoFi\'s medical refinancing page for current, profession-specific terms.',
    ],
    content: `
# Student Loan Refinancing for Doctors and Dentists: What Makes It Different

${DISCLOSURE}

[![SoFi student loan refinancing for medical and dental professionals](/images/sofi/medical-refi.svg)](${MEDICAL})

If you're a physician or dentist, your student loan situation doesn't look like the average borrower's — and generic refinancing advice often misses what actually matters for you. Two things make your case different: the **size** of the balances, and the **shape** of your career.

For current, profession-specific terms, go straight to **[SoFi's medical refinancing page](${MEDICAL})**.

## Why the numbers are different

Medical and dental graduates routinely carry balances that dwarf most other fields. When the principal is that large, even a modest difference in rate compounds into real money over the life of the loan. That's exactly why refinancing gets so much attention in medical circles — the stakes per decision are simply higher.

But bigger stakes cut both ways: a wrong move (like giving up a federal benefit you needed) is also more costly. So the analysis deserves more care, not less.

## The residency and training factor

Here's what's genuinely different for doctors and dentists: your **income arc**. During residency or a fellowship, earnings are modest relative to your eventual attending or practice income. Some refinancing programs are built with this in mind — accounting for training periods and the income jump that typically follows.

That timing question — refinance during training, or wait until you're earning your full income? — is one of the most important calls you'll make, and it's worth thinking through deliberately.

[![Check your refinancing options as a medical professional](/images/sofi/medical-refi.svg)](${MEDICAL})

## The forgiveness trade-off is bigger for you

Many physicians and dentists work in settings that could qualify for loan forgiveness through programs tied to qualifying employment. If that's a path you might take, **refinancing federal loans into a private loan would forfeit that eligibility.** For high-balance borrowers, that's not a small thing — model it out before you decide.

## Before you refinance

- Separate **federal from private** loans, and be honest about whether forgiveness is realistically part of your plan.
- Factor in your **training timeline** and expected income jump.
- Because balances are large, compare **total lifetime cost** carefully.
- Confirm current, profession-specific terms on [SoFi's official medical refinancing page](${MEDICAL}).

---

### Next step

If refinancing fits your career stage and plans, it's worth seeing your real options.

**[→ Explore SoFi refinancing for doctors and dentists](${MEDICAL})**

*SoFi runs referral bonuses on its money products, too — you and a friend can each earn a bonus on an eligible funded account. [See official rules](${RULES}).*
`,
  },

  // ======================= 4. PRIVATE STUDENT LOANS =========================
  {
    id: 'post-sofi-4',
    title: 'SoFi Private Student Loans: When They Make Sense (and When to Wait)',
    slug: 'sofi-private-student-loans-guide',
    excerpt: 'Private student loans can fill a funding gap after federal aid — but the order you borrow in matters. Here\'s a sensible framework for students and families.',
    category: 'SoFi Bank',
    tags: ['SoFi', 'Student Loans', 'Private Student Loans', 'College Funding'],
    coverImage: '/images/sofi/private-student.svg',
    author: AUTHOR,
    publishedAt: '2026-08-30',
    readTimeMinutes: 8,
    difficulty: 'Beginner',
    featured: false,
    views: 0,
    likes: 0,
    rating: 0,
    ratingCount: 0,
    seoKeywords: ['sofi private student loans', 'private student loans', 'college funding', 'student loan for college'],
    metaDescription: 'When SoFi private student loans make sense, why to exhaust federal aid first, and what students and families should weigh. Affiliate disclosure included.',
    keyTakeaways: [
      'Private student loans are best used to fill a gap after you\'ve exhausted grants, scholarships, and federal aid.',
      'A creditworthy cosigner can affect eligibility and terms for many students.',
      'Borrow only what you truly need — future-you has to repay every dollar with interest.',
      'Check SoFi\'s private student loan page for current terms and eligibility.',
    ],
    content: `
# SoFi Private Student Loans: When They Make Sense (and When to Wait)

${DISCLOSURE}

[![Explore SoFi private student loans](/images/sofi/private-student.svg)](${PRIVATE})

Paying for college is rarely one decision — it's a stack of them, in a specific order. Private student loans have a real place in that stack, but only after a few other steps come first. Get the order right and a private loan is a sensible gap-filler. Get it wrong and you borrow more than you needed to.

For current terms and eligibility, see **[SoFi's private student loan page](${PRIVATE})**.

## The right order to fund college

Think of funding in tiers, cheapest first:

1. **Free money** — grants and scholarships. Always max this out; it never has to be repaid.
2. **Federal student aid** — fill out the FAFSA. Federal loans come with protections and repayment options private loans don't.
3. **Private student loans** — to fill any remaining gap after the first two tiers.

Private loans land in tier three for a reason: they're best as a **gap-filler**, not a first resort. If you still have a funding gap after grants, scholarships, and federal aid, that's precisely when a private loan earns its place.

## What students and families should weigh

- **A cosigner often matters.** Many students don't yet have the credit history to qualify strongly on their own, so a creditworthy cosigner can affect eligibility and terms.
- **Borrow only what you truly need.** Every dollar is repaid later with interest. The number that feels abstract now is very real at graduation.
- **Understand repayment before you sign** — when it starts, and what your options are.

[![See if a SoFi private student loan fits your funding gap](/images/sofi/private-student.svg)](${PRIVATE})

## An honest note

I'm not going to quote rates or promise approval — that depends on your (or your cosigner's) profile and is set by the lender. What I can tell you is that SoFi is a reputable option for the private-loan tier, and it costs nothing to check what you'd qualify for once you know your gap.

## Before you borrow

- Confirm you've exhausted **grants, scholarships, and federal aid** first.
- Calculate your **actual gap** — then borrow that, not more.
- Review current terms on [SoFi's official page](${PRIVATE}).

---

### Next step

If you've done the free-money and federal steps and still have a gap, here's where to look.

**[→ Explore SoFi private student loans](${PRIVATE})**

*SoFi also offers referral bonuses on its money products for you and a friend on an eligible funded account. [See official rules](${RULES}).*
`,
  },

  // ===================== 5. REFERRAL / MONEY BONUS ==========================
  {
    id: 'post-sofi-5',
    title: 'How the SoFi Referral Bonus Works — Earn Up to $125 With a Friend',
    slug: 'sofi-referral-bonus-guide',
    excerpt: 'SoFi\'s referral program lets you and a friend each earn a bonus when they open and fund an eligible account. Here\'s exactly how it works and how to qualify.',
    category: 'SoFi Bank',
    tags: ['SoFi', 'Referral Bonus', 'Bank Bonus', 'Personal Finance'],
    coverImage: '/images/sofi/referral-money.svg',
    author: AUTHOR,
    publishedAt: '2026-08-30',
    readTimeMinutes: 6,
    difficulty: 'Beginner',
    featured: true,
    views: 0,
    likes: 0,
    rating: 0,
    ratingCount: 0,
    seoKeywords: ['sofi referral bonus', 'sofi referral code', 'sofi money bonus', 'refer a friend bonus'],
    metaDescription: 'How the SoFi referral bonus works: open and fund an eligible account with a referral link and you both can earn a bonus. See official rules for current terms.',
    keyTakeaways: [
      'You and a friend can each earn a bonus when they open an eligible SoFi account through your referral link and fund it.',
      'The friend typically needs to open the account within a set window and add a minimum deposit — check the official rules for exact figures.',
      'A limited-time extra bonus may apply when the new member signs up for SoFi Plus.',
      'Always confirm current amounts, timelines, and eligibility in SoFi\'s official rules — they change.',
    ],
    content: `
# How the SoFi Referral Bonus Works — Earn Up to $125 With a Friend

${DISCLOSURE}

[![Join SoFi with a referral link](/images/sofi/referral-money.svg)](${MONEY})

Bank referral bonuses are one of the few genuinely free wins in personal finance: money for something you were going to do anyway. SoFi's referral program is a solid example — **you and a friend can each earn a bonus** when they open and fund an eligible account through a referral link.

Here's how it works, in plain terms. For the exact, current amounts and eligibility, always **[see official rules](${RULES})** — SoFi sets these and they change.

## The basics

At a high level, the flow looks like this:

- Your friend opens a **new eligible SoFi account** using a referral link.
- They **fund it** with the required minimum deposit within the eligibility window.
- **You both get a bonus.** There's also been a limited-time extra bonus when the new member signs up for SoFi Plus — which is how the total can reach up to **$125** between you.

I'm deliberately not going to hard-quote every figure here, because promo amounts and timelines shift. The one source that's always right is SoFi's own page: **[see official rules](${RULES})**.

## How to actually qualify (the practical checklist)

1. Your friend uses a **referral link** to open a new, eligible account — not a plain sign-up.
2. They open it **within the required window** (there's a time limit — check the rules).
3. They add **at least the minimum deposit** the program requires.
4. For the extra limited-time bonus, they sign up for **SoFi Plus**.

Miss any of those and the bonus may not pay out — the details genuinely matter here, which is exactly why the [official rules](${RULES}) are worth a two-minute read before you start.

[![Open your SoFi account and start the bonus](/images/sofi/referral-money.svg)](${MONEY})

## A quick, honest disclosure

To be clear and conspicuous about it: if you use my referral link, I may receive a referral bonus, and you may receive a welcome bonus. That's the deal, out in the open. I'm sharing it because it's a legitimately good offer for something you might do anyway — not because I can promise you'll qualify. Eligibility is determined by SoFi under its [official rules](${RULES}).

---

### Ready to grab the bonus?

If you were thinking about a new checking and savings account anyway, doing it through a referral link means you both come out ahead.

**[→ Join SoFi and start your bonus](${MONEY})**

*Bonus amounts, timelines, and eligibility are set by SoFi and can change. [See official rules](${RULES}) for the current terms.*
`,
  },
];
