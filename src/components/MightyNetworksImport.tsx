import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle, CheckCircle, Clock, Copy, ExternalLink, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MightyNetworksImport: React.FC = () => {
  const { supabase } = useAuth();
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    // Construct the webhook URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const functionUrl = new URL('/functions/v1/mn-webhook', supabaseUrl);
      setWebhookUrl(functionUrl.href);
    }

    // Get the API key from environment
    const zapierKey = import.meta.env.VITE_MIGHTY_NETWORKS_ZAPIER;
    if (zapierKey) {
      setApiKey(zapierKey);
    } else {
      setApiKey('your-secure-zapier-api-key');
    }
  }, [supabase]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 p-6 bg-jennaz-purple rounded-lg border border-jennaz-rose/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Zap className="w-6 h-6 text-jennaz-rose mr-3" />
            Connect Facebook (Mighty Networks) via Zapier
          </h3>
          <p className="text-gray-400">Use Zapier's "Member Activity" trigger to automatically sync member data to your affiliate system.</p>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/mightynetworks.png" alt="Mighty Networks Logo" className="w-12 h-12" />
          <span className="text-gray-400">+</span>
          <img src="/zapier.png" alt="Zapier Logo" className="w-12 h-12" />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-semibold mb-1">Zapier Integration Notice</h4>
            <p className="text-blue-200 text-sm">
              Since Mighty Networks doesn't have direct export functionality, we use Zapier's "Member Activity" trigger 
              which fires for joins, purchases, cancellations, and profile updates. Our webhook intelligently determines 
              the event type and processes it accordingly.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1: Webhook URL */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-jennaz-rose text-jennaz-purple-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
            Your Webhook URL
          </h4>
          <p className="text-gray-400 mb-3">
            Copy this URL and paste it into the "Webhook URL" field in your Zapier webhook action.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="input-field flex-1 font-mono text-sm"
            />
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-jennaz-rose text-jennaz-purple-dark rounded-md flex items-center hover:bg-jennaz-rose/90 transition-colors"
            >
              {isCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Step 2: API Key */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-jennaz-rose text-jennaz-purple-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
            Authentication API Key
          </h4>
          <p className="text-gray-400 mb-3">
            Include this API key in your Zapier webhook payload for authentication.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="input-field flex-1 font-mono text-sm"
            />
            <button
              onClick={handleCopyApiKey}
              className="px-4 py-2 bg-jennaz-rose text-jennaz-purple-dark rounded-md flex items-center hover:bg-jennaz-rose/90 transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Step 3: Zapier Setup */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-jennaz-rose text-jennaz-purple-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
            Zapier Configuration
          </h4>
          
          <div className="space-y-4">
            <div className="bg-jennaz-purple-dark rounded-lg p-4">
              <h5 className="font-semibold text-white mb-2">Trigger Setup</h5>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <strong>App:</strong> Mighty Networks</li>
                <li>• <strong>Trigger:</strong> Member Activity</li>
                <li>• <strong>Event:</strong> Select "joins", "purchases", or "all activities"</li>
              </ul>
            </div>

            <div className="bg-jennaz-purple-dark rounded-lg p-4">
              <h5 className="font-semibold text-white mb-2">Action Setup</h5>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <strong>App:</strong> Webhooks by Zapier</li>
                <li>• <strong>Action:</strong> POST</li>
                <li>• <strong>URL:</strong> Use the webhook URL from step 1</li>
                <li>• <strong>Payload Type:</strong> JSON</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 4: JSON Payload */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-jennaz-rose text-jennaz-purple-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
            JSON Payload Structure
          </h4>
          <p className="text-gray-400 mb-3">
            Configure your Zapier webhook to send this JSON structure. Map the Mighty Networks fields to the corresponding JSON keys:
          </p>
          
          <div className="bg-jennaz-purple-dark rounded-lg p-4">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "api_key": "${apiKey}",
  "member_id": "{{Member ID}}",
  "email": "{{Email}}",
  "first_name": "{{First Name}}",
  "last_name": "{{Last Name}}",
  "name": "{{Full Name}}",
  "activity_type": "{{Activity Type}}",
  "amount": "{{Amount}}",
  "currency": "{{Currency}}",
  "product_name": "{{Product Name}}",
  "plan_name": "{{Plan Name}}",
  "order_id": "{{Order ID}}",
  "transaction_id": "{{Transaction ID}}",
  "timestamp": "{{Timestamp}}",
  "referred_by": "{{Referrer Email}}"
}`}
            </pre>
          </div>

          <div className="mt-4 bg-amber-900/20 border border-amber-400/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-amber-200 text-sm">
                <strong>Field Mapping:</strong> Replace the placeholder values (like &quot;Member ID&quot;) with the actual field mappings from your Mighty Networks trigger. Not all fields are required - the webhook will intelligently process whatever data is available.
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Event Detection */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-jennaz-rose text-jennaz-purple-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
            Automatic Event Detection
          </h4>
          <p className="text-gray-400 mb-3">
            Our webhook automatically detects the event type based on the data:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-jennaz-purple-dark rounded-lg p-4">
              <h5 className="font-semibold text-white mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                New Member/Affiliate
              </h5>
              <p className="text-gray-300 text-sm mb-2">Detected when:</p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Activity type includes "join", "signup", or "registered"</li>
                <li>• OR when no purchase data is present</li>
              </ul>
            </div>
            
            <div className="bg-jennaz-purple-dark rounded-lg p-4">
              <h5 className="font-semibold text-white mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Purchase/Sale
              </h5>
              <p className="text-gray-300 text-sm mb-2">Detected when:</p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Activity type includes "purchase", "bought", or "paid"</li>
                <li>• OR when amount and product info are present</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-jennaz-rose/20 text-center">
        <a 
          href="https://zapier.com/app/editor" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-jennaz-rose hover:text-jennaz-rose/80 transition-colors"
        >
          Set up your Zap in Zapier <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default MightyNetworksImport; 