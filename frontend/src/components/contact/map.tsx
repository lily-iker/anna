import { Card } from '@/components/ui/card'

export default function Map() {
  return (
    <Card className="overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d658.5996173314793!2d105.76384514122294!3d20.968490707163156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452df4fb09f93%3A0xea846dbc0b93df61!2zMTIxIFAuIFBoYW4gxJDDrG5oIEdpw7N0LCBMYSBLaMOqLCBIw6AgxJDDtG5nLCBIw6AgTuG7mWkgMTAwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1746008187949!5m2!1svi!2s"
        className="w-full h-[450px] border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </Card>
  )
}
