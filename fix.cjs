const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

code = code.replace(`                ))}
              </div>
                ))}
              </div>
            </div>`, `                ))}
              </div>
            </div>`);

// wait, let's just use regex for replacing lines 276, 277 if they are `                ))}              </div>`. Let's do it manually using split

let lines = code.split('\\n');
lines = lines.filter((line, index) => {
    return !(index === 276 || index === 277);
});
fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', lines.join('\\n'));
