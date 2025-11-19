import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/constants/constants';

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground text-lg">
            I'm always open to discussing new projects and opportunities
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Me</CardTitle>
            <CardDescription>
              Feel free to reach out through any of these channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
              {PERSONAL_INFO.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                  <a
                    href={`tel:${PERSONAL_INFO.phone}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {PERSONAL_INFO.phone}
                  </a>
                </div>
              )}
            </div>

            {SOCIAL_LINKS.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  Connect with me
                </p>
                <div className="flex flex-wrap gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <Button
                      key={social.name}
                      variant="outline"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

