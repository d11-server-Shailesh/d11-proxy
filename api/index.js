const axios = require('axios');

module.exports = async (req, res) => {
  // CORS Headers (App ko connect karne ke liye)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-secret-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // SECURITY CHECK: Tumhari app ke ilawa koi WAF bypass nahi kar payega
  if (req.headers['x-secret-key'] !== 'JOHN_CENA_619') {
    return res.status(403).json({ error: "Access Denied! Tum hacker ho." });
  }

  const { targetUrl, dream11Token, bodyData } = req.body;

  if (!targetUrl || !dream11Token) {
    return res.status(400).json({ error: "URL ya Token missing hai!" });
  }

  try {
    const response = await axios({
      method: 'post',
      url: targetUrl,
      headers: {
        'Host': 'www.dream11.com',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Device': 'androidplaystore',
        'Devicetype': 'ANDROID',
        'App_version': '7.8.0',
        'Version': '13091',
        'Siteid': '1',
        'Locale': 'en-US',
        'Authorization': `Bearer ${dream11Token}`,
        'User-Agent': 'Dream11/7.8.0 (Linux; Android 28; SHG07) Build/10091'
      },
      data: bodyData
    });

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json(
      error.response ? error.response.data : { error: "Server Error" }
    );
  }
};
