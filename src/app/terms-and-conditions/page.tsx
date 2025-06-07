
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions | CommerceFlow',
  description: 'Read the terms and conditions for using CommerceFlow.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="text-center border-b pb-6">
          <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Terms and Conditions</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Last Updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
                <p>
                  Welcome to CommerceFlow! These terms and conditions outline the rules and regulations for the use of
                  CommerceFlow's Website, located at your website's URL. By accessing this website we assume you
                  accept these terms and conditions. Do not continue to use CommerceFlow if you do not agree to
                  take all of the terms and conditions stated on this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">2. Intellectual Property Rights</h2>
                <p>
                  Other than the content you own, under these Terms, CommerceFlow and/or its licensors own all the
                  intellectual property rights and materials contained in this Website. You are granted limited license
                  only for purposes of viewing the material contained on this Website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">3. Restrictions</h2>
                <p>You are specifically restricted from all of the following:</p>
                <ul className="list-disc list-inside pl-4 space-y-1 mt-2">
                  <li>Publishing any Website material in any other media;</li>
                  <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                  <li>Publicly performing and/or showing any Website material;</li>
                  <li>Using this Website in any way that is or may be damaging to this Website;</li>
                  <li>Using this Website in any way that impacts user access to this Website;</li>
                  <li>
                    Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the
                    Website, or to any person or business entity;
                  </li>
                  <li>
                    Engaging in any data mining, data harvesting, data extracting or any other similar activity in
                    relation to this Website;
                  </li>
                  <li>Using this Website to engage in any advertising or marketing.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">4. Your Content</h2>
                <p>
                  In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text,
                  images or other material you choose to display on this Website. By displaying Your Content, you grant
                  CommerceFlow a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt,
                  publish, translate and distribute it in any and all media.
                </p>
                <p className="mt-2">
                  Your Content must be your own and must not be invading any third-party's rights. CommerceFlow reserves
                  the right to remove any of Your Content from this Website at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">5. No warranties</h2>
                <p>
                  This Website is provided “as is,” with all faults, and CommerceFlow express no representations or
                  warranties, of any kind related to this Website or the materials contained on this Website. Also,
                  nothing contained on this Website shall be interpreted as advising you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitation of liability</h2>
                <p>
                  In no event shall CommerceFlow, nor any of its officers, directors and employees, shall be held liable
                  for anything arising out of or in any way connected with your use of this Website whether such liability
                  is under contract. CommerceFlow, including its officers, directors and employees shall not be held
                  liable for any indirect, consequential or special liability arising out of or in any way related to your
                  use of this Website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">7. Indemnification</h2>
                <p>
                  You hereby indemnify to the fullest extent CommerceFlow from and against any and/or all liabilities,
                  costs, demands, causes of action, damages and expenses arising in any way related to your breach of any
                  of the provisions of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">8. Severability</h2>
                <p>
                  If any provision of these Terms is found to be invalid under any applicable law, such provisions shall
                  be deleted without affecting the remaining provisions herein.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">9. Variation of Terms</h2>
                <p>
                  CommerceFlow is permitted to revise these Terms at any time as it sees fit, and by using this Website
                  you are expected to review these Terms on a regular basis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">10. Assignment</h2>
                <p>
                  The CommerceFlow is allowed to assign, transfer, and subcontract its rights and/or obligations under
                  these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract
                  any of your rights and/or obligations under these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">11. Entire Agreement</h2>
                <p>
                  These Terms constitute the entire agreement between CommerceFlow and you in relation to your use of
                  this Website, and supersede all prior agreements and understandings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">12. Governing Law & Jurisdiction</h2>
                <p>
                  These Terms will be governed by and interpreted in accordance with the laws of the State/Country of
                  Your Jurisdiction, and you submit to the non-exclusive jurisdiction of the state and federal courts
                  located in State/Country of Your Jurisdiction for the resolution of any disputes.
                </p>
                <p className="mt-4 text-sm italic">
                  (This is a placeholder. Please replace with your actual Terms and Conditions.)
                </p>
              </section>
            </div>
          </ScrollArea>
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/signup">Back to Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
