export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal font-semibold mb-2">
          Settings
        </h1>
        <p className="text-gray">Configure your site settings and preferences</p>
      </div>

      <div className="bg-white rounded-sm shadow-luxury p-6">
        <h3 className="font-display text-lg text-charcoal font-semibold mb-4">
          Scraper Configuration
        </h3>
        <div className="space-y-4 text-sm text-gray">
          <p>
            <strong className="text-charcoal">Source URL:</strong>{" "}
            {process.env.SOURCE_SITE_URL || "https://www.elpaseoauto.com"}
          </p>
          <p>
            The scraper is configured with flexible selectors that may need to be
            updated based on the source site&apos;s HTML structure.
          </p>
          <p>
            Edit <code className="bg-off-white px-2 py-1 rounded">lib/scraper.ts</code>{" "}
            to update the CSS selectors for your source site.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-luxury p-6">
        <h3 className="font-display text-lg text-charcoal font-semibold mb-4">
          Environment Variables
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-4">
            <code className="bg-off-white px-2 py-1 rounded text-charcoal">
              DATABASE_URL
            </code>
            <span className="text-gray">MySQL connection string</span>
          </div>
          <div className="flex items-start gap-4">
            <code className="bg-off-white px-2 py-1 rounded text-charcoal">
              SOURCE_SITE_URL
            </code>
            <span className="text-gray">URL of the site to scrape</span>
          </div>
          <div className="flex items-start gap-4">
            <code className="bg-off-white px-2 py-1 rounded text-charcoal">
              ADMIN_PASSWORD
            </code>
            <span className="text-gray">Password for admin API access</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-luxury p-6">
        <h3 className="font-display text-lg text-charcoal font-semibold mb-4">
          Cron Job Setup
        </h3>
        <p className="text-sm text-gray mb-4">
          To automatically sync inventory, create a cron job that calls the scrape API:
        </p>
        <pre className="bg-charcoal text-green-400 p-4 rounded-sm text-sm overflow-x-auto">
{`# Daily at 6 AM UTC
0 6 * * * curl -X POST https://your-site.com/api/scrape \\
  -H "X-API-Key: YOUR_ADMIN_PASSWORD"`}
        </pre>
        <p className="text-sm text-gray mt-4">
          Or use Vercel Cron with <code className="bg-off-white px-2 py-1 rounded">vercel.json</code>
        </p>
      </div>
    </div>
  );
}
