import dns from 'dns/promises';

// Force IPv4 and Google DNS
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8:53', '8.8.4.4:53']);

console.log("Testing DNS resolution...");

try {
    const result = await dns.resolveSrv('_mongodb._tcp.cluster0.ny7m6ic.mongodb.net');
    console.log('✅ DNS works:', result);
} catch (err) {
    console.error('❌ Failed:', err.message);
    console.error('Code:', err.code);
}

console.log("Done.");