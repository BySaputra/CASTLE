import numpy as np
import matplotlib.pyplot as plt

# Frekuensi (Hz)
f = np.array([10e3, 20e3, 30e3])

# Amplitudo (Volt)
A = np.array([10, 10, 10])

# Tambahkan frekuensi negatif (simetris)
f_full = np.concatenate((-f[::-1], f))
A_full = np.concatenate((A[::-1], A))

# Plot
plt.figure()
plt.stem(f_full/1000, A_full, basefmt=" ")  # dibagi 1000 jadi kHz
plt.xlabel('Frekuensi (kHz)')
plt.ylabel('Amplitudo (V)')
plt.title('Spektrum Frekuensi Sinyal Komposit')
plt.grid(True)

plt.xlim(-35, 35)
plt.ylim(0, 12)

plt.show()