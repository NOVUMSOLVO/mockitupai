#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/fix-rem-comments.sh
# Fix REM comments in shell scripts

echo "====== Fixing REM comments in shell scripts ======"

# Check setup-payment-env.sh
echo "Checking setup-payment-env.sh..."
if grep -q "REM filepath" setup-payment-env.sh; then
  echo "Found REM comments in setup-payment-env.sh, fixing..."
  # Create a temporary file without REM comments
  grep -v "REM filepath" setup-payment-env.sh > setup-payment-env.sh.fixed
  mv setup-payment-env.sh.fixed setup-payment-env.sh
  chmod +x setup-payment-env.sh
  echo "✅ Fixed setup-payment-env.sh"
else
  echo "No REM comments found in setup-payment-env.sh"
fi

# Check all other shell scripts
for script in *.sh; do
  if [ "$script" != "fix-rem-comments.sh" ]; then
    echo "Checking $script..."
    if grep -q "REM filepath" "$script"; then
      echo "Found REM comments in $script, fixing..."
      # Create a temporary file without REM comments
      grep -v "REM filepath" "$script" > "$script.fixed"
      mv "$script.fixed" "$script"
      chmod +x "$script"
      echo "✅ Fixed $script"
    fi
  fi
done

echo ""
echo "====== All REM comments fixed ======"
