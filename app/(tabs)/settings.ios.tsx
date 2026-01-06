
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  useColorScheme,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/styles/commonStyles';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const [affiliateMode, setAffiliateMode] = React.useState(false);

  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <Text style={[styles.title, { color: currentColors.text }]}>Settings</Text>

      <View style={[styles.section, { backgroundColor: currentColors.card }]}>
        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
          Appearance
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <IconSymbol
              ios_icon_name="moon.stars.fill"
              android_material_icon_name="dark-mode"
              size={24}
              color={currentColors.text}
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                Dark Mode
              </Text>
              <Text
                style={[styles.settingDescription, { color: currentColors.textSecondary }]}
              >
                Use dark theme throughout the app
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: currentColors.card }]}>
        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
          Monetization
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <IconSymbol
              ios_icon_name="dollarsign.circle.fill"
              android_material_icon_name="attach-money"
              size={24}
              color={currentColors.text}
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                Affiliate Mode
              </Text>
              <Text
                style={[styles.settingDescription, { color: currentColors.textSecondary }]}
              >
                Support us with affiliate recommendations
              </Text>
            </View>
          </View>
          <Switch
            value={affiliateMode}
            onValueChange={setAffiliateMode}
            trackColor={{ false: '#D1D5DB', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
});
