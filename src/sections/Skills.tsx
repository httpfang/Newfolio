import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SKILLS } from '@/constants/constants';
import type { Skill } from '@/types/types';

const categoryLabels: Record<Skill['category'], string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  tool: 'Tools',
  other: 'Other',
};

function SkillCard({ skill }: { skill: Skill }) {
  const levelColors = {
    beginner: 'bg-blue-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-green-500',
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{skill.name}</span>
        {skill.level && (
          <span className="text-xs text-muted-foreground capitalize">
            {skill.level}
          </span>
        )}
      </div>
      {skill.level && (
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full ${levelColors[skill.level]}`}
            style={{
              width:
                skill.level === 'beginner'
                  ? '33%'
                  : skill.level === 'intermediate'
                    ? '66%'
                    : '100%',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function Skills() {
  const skillsByCategory = SKILLS.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<Skill['category'], Skill[]>
  );

  if (SKILLS.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills</h2>
          <p className="text-muted-foreground text-lg">
            Technologies and tools I work with
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {categoryLabels[category as Skill['category']]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {skills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

