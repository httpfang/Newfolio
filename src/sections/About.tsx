import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PERSONAL_INFO } from '@/constants/constants';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground text-lg">
            Get to know more about my background and passion
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Who I Am</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-foreground">{PERSONAL_INFO.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

