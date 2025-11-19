import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EXPERIENCES } from '@/constants/constants';
import type { Experience } from '@/types/types';

function ExperienceCard({ experience }: { experience: Experience }) {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">{experience.title}</CardTitle>
            <p className="text-muted-foreground font-medium mt-1">
              {experience.company}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{experience.location}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(experience.startDate)} -{' '}
            {experience.endDate ? formatDate(experience.endDate) : 'Present'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {experience.description.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1.5">•</span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExperienceSection() {
  if (EXPERIENCES.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience</h2>
          <p className="text-muted-foreground text-lg">
            My professional journey and work experience
          </p>
        </div>

        <div className="space-y-6">
          {EXPERIENCES.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
}

