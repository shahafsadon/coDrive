const cppClient = require('../services/cppServerClient');

exports.search = async (req, res, next) => {
  try {
    const query = req.params.query;
    // send SEARCH command to C++ server
    const rawResponse = await cppClient.send(`SEARCH ${query}`);
    // normalize response
    const responseLine = rawResponse.trim();
    // pass parsed response forward
    res.locals.cppResponse = responseLine;
    next();
  } catch (err) {
    next(err);
  }
};

exports.formatSearchResult = (req, res) => {
  const cppResponse = res.locals.cppResponse;
  // parse C++ server response and format HTTP response accordingly
  if (cppResponse.startsWith('200')) {
    return res.status(200).json({
      result: cppResponse
    });
  }

  // handle known error responses
  if (cppResponse.startsWith('404')) {
    return res.status(404).json({
      error: 'Not found'
    });
  }
  
  // handle server error response
  if (cppResponse.startsWith('500')) {
    return res.status(500).json({
      error: 'Server error'
    });
  }

  // fallback – unexpected response
  return res.status(502).json({
    error: 'Bad response from C++ server',
    raw: cppResponse
  });
};
