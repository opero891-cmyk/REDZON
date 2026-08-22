package com.redzon.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

private val Ink = Color(0xFF09111D)
private val Cyan = Color(0xFF2DD4BF)
private val Muted = Color(0xFF91A5B8)

class SplashActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { SplashScreen(this) }
    }
}

@Composable
private fun SplashScreen(activity: SplashActivity) {
    var status by remember { mutableStateOf("جار فحص صلاحية ROOT...") }
    var progress by remember { mutableStateOf(0f) }
    var rootAvailable by remember { mutableStateOf(false) }
    var checkingComplete by remember { mutableStateOf(false) }
    
    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(durationMillis = 1000)
    )

    LaunchedEffect(Unit) {
        // Simulate loading delay
        delay(500)
        progress = 0.3f
        status = "جاري اختبار الوصول إلى النظام..."
        
        delay(500)
        progress = 0.6f
        
        // Check for root
        val rootCheckResult = withContext(Dispatchers.IO) {
            RootCommand.isRootAvailable()
        }
        
        rootAvailable = rootCheckResult
        progress = 0.9f
        
        if (rootAvailable) {
            status = "✓ ROOT متوفر - جاري بدء التطبيق"
        } else {
            status = "✗ ROOT غير متاح - سيعمل بوضع محدود"
        }
        
        delay(1000)
        progress = 1f
        checkingComplete = true
        
        // Navigate to MainActivity
        delay(500)
        activity.startActivity(Intent(activity, MainActivity::class.java))
        activity.finish()
    }

    Surface(modifier = Modifier.fillMaxSize(), color = Ink) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Ink),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "REDZON",
                fontSize = 48.sp,
                fontWeight = FontWeight.Black,
                color = Cyan
            )
            
            Text(
                text = "Performance Control",
                fontSize = 16.sp,
                color = Muted,
                fontWeight = FontWeight.Light
            )
            
            Spacer(modifier = Modifier.height(60.dp))
            
            CircularProgressIndicator(
                progress = { animatedProgress },
                modifier = Modifier.height(80.dp),
                color = Cyan,
                strokeWidth = 4.dp
            )
            
            Spacer(modifier = Modifier.height(40.dp))
            
            Text(
                text = status,
                fontSize = 14.sp,
                color = Muted,
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            Text(
                text = "${(animatedProgress * 100).toInt()}%",
                fontSize = 24.sp,
                color = Cyan,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
