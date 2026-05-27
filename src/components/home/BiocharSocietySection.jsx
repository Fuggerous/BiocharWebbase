// @ts-nocheck
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ORGS = [
  {
    name: 'MTEC-NZE Biochar',
    nameTh: 'ศูนย์วิจัยโลหะและวัสดุ (MTEC)',
    descKey: 'soc.org.mtec.desc',
    tagKey: 'soc.org.mtec.tag',
    color: 'border-blue-500/30 hover:border-blue-500/60',
    tagColor: 'bg-blue-500/10 text-blue-600',
    emoji: '🔬',
    url: 'https://www.mtec.or.th',
  },
  {
    name: 'NSTDA Thailand',
    nameTh: 'สวทช. — สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ',
    descKey: 'soc.org.nstda.desc',
    tagKey: 'soc.org.nstda.tag',
    color: 'border-green-500/30 hover:border-green-500/60',
    tagColor: 'bg-green-500/10 text-green-600',
    emoji: '🏛️',
    url: 'https://www.nstda.or.th',
  },
  {
    name: 'Thai Biochar Society',
    nameTh: 'สมาคมไบโอชาร์ไทย',
    descKey: 'soc.org.biochar.desc',
    tagKey: 'soc.org.biochar.tag',
    color: 'border-emerald-500/30 hover:border-emerald-500/60',
    tagColor: 'bg-emerald-500/10 text-emerald-600',
    emoji: '🌱',
    url: '#',
  },
  {
    name: 'Kasetsart University',
    nameTh: 'มหาวิทยาลัยเกษตรศาสตร์',
    descKey: 'soc.org.kasetsart.desc',
    tagKey: 'soc.org.kasetsart.tag',
    color: 'border-amber-500/30 hover:border-amber-500/60',
    tagColor: 'bg-amber-500/10 text-amber-600',
    emoji: '🎓',
    url: 'https://www.ku.ac.th',
  },
  {
    name: 'Thailand Greenhouse Gas Management Organization',
    nameTh: 'องค์การบริหารจัดการก๊าซเรือนกระจก (อบก.)',
    descKey: 'soc.org.tgo.desc',
    tagKey: 'soc.org.tgo.tag',
    color: 'border-purple-500/30 hover:border-purple-500/60',
    tagColor: 'bg-purple-500/10 text-purple-600',
    emoji: '🌍',
    url: 'https://www.tgo.or.th',
  },
  {
    name: 'Department of Agriculture',
    nameTh: 'กรมวิชาการเกษตร',
    descKey: 'soc.org.doa.desc',
    tagKey: 'soc.org.doa.tag',
    color: 'border-rose-500/30 hover:border-rose-500/60',
    tagColor: 'bg-rose-500/10 text-rose-600',
    emoji: '🌾',
    url: 'https://www.doa.go.th',
  },
];

export default function BiocharSocietySection() {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language.startsWith('th');

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-4">
            {t('soc.badge')}
          </span>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-3">
            {t('soc.heading')} <span className="text-gradient-green">{t('soc.headingHighlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('soc.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ORGS.map((org, i) => (
            <motion.a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group glass-card rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${org.color}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{org.emoji}</div>
                  <div>
                    <h3 className="font-space font-bold text-sm leading-snug">{isThai ? org.nameTh : org.name}</h3>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">{isThai ? org.name : org.nameTh}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-0.5 transition-colors" />
              </div>

              {/* Tag */}
              <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${org.tagColor}`}>
                {t(org.tagKey)}
              </span>

              {/* Description */}
              <p className="text-muted-foreground text-xs leading-relaxed flex-1">{t(org.descKey)}</p>

              {/* Footer link */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors pt-1 border-t border-border">
                <Globe className="w-3.5 h-3.5" />
                <span className="truncate">{org.url.replace('https://','')}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
