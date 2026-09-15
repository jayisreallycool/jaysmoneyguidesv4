import { NextResponse } from 'next/server';

// Clean, rotatable affiliate redirects. Articles link to /go/<campaign>.
const LINKS: Record<string, string> = {
  'sofi-personal': 'https://www.sofi.com/invite/personal-loans?gcp=f694b62f-0bd0-46e4-8489-13fa4dbe2d57&isAliasGcp=false&siid=2c10d514-bead-4026-a011-aa5f1593513b',
  'sofi-student': 'https://www.sofi.com/invite/student-loans?gcp=10cf9c52-9d29-43fe-9672-491f50ebbe13&isAliasGcp=false&siid=4986fd59-30ed-45d7-83d8-cb2f324faa87',
  'sofi-medical': 'https://www.sofi.com/invite/medical-student-loans?gcp=15f11045-eed3-480b-816d-69a83f2cd79b&isAliasGcp=false&siid=c8eca57f-268c-44cd-85ef-f962aa1da6e1',
  'sofi-private': 'https://www.sofi.com/invite/private-student-loans?gcp=ddf331f3-ccfb-49e6-92b9-58f7877a7342&isAliasGcp=false&siid=10afddd8-1ecd-4672-9b52-5495e8eec6b7',
  'sofi-money': 'https://www.sofi.com/invite/money?gcp=cbb90c63-c9ec-487c-a425-bb95feac5201&isAliasGcp=false&siid=c0a81ea2-40c9-4fcc-9a3a-9a54766f7012',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ campaign: string }> }
) {
  const { campaign } = await params;
  const target = LINKS[campaign];
  if (!target) return NextResponse.json({ error: 'Unknown campaign' }, { status: 404 });
  return NextResponse.redirect(target, 302);
}
