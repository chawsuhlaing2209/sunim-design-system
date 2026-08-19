// jest-dom's matchers (toBeInTheDocument, toBeDisabled, toHaveClass, …) are not
// registered on vitest's expect by default. Component tests need them.
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only auto-registers its cleanup when the test globals are
// injected. This project imports describe/it/expect explicitly, so unmount
// between tests here — otherwise renders stack up and queries find duplicates.
afterEach(cleanup);
